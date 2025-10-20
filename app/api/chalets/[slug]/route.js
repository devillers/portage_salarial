import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '../../../../lib/mongodb';
import Chalet from '../../../../models/Chalet';
import { requireAuth, verifyToken } from '../../../../lib/auth';

const escapeRegex = (value = '') => value.toString().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const decodeSlugValue = (value) => {
  if (value === undefined || value === null) {
    return '';
  }

  const stringValue = value.toString();

  try {
    return decodeURIComponent(stringValue);
  } catch (error) {
    return stringValue;
  }
};

const normalizeWhitespace = (value = '') => value.replace(/\s+/g, ' ').trim();

const stripDiacritics = (value = '') => {
  if (typeof value !== 'string' || typeof value.normalize !== 'function') {
    return value;
  }

  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
};

const slugifyModelStyle = (value = '') => {
  if (!value) {
    return '';
  }

  const base = stripDiacritics(value.toLowerCase());

  return base
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .trim();
};

const buildSlugCandidates = (value) => {
  const decoded = normalizeWhitespace(decodeSlugValue(value));

  if (!decoded) {
    return [];
  }

  const lower = decoded.toLowerCase();
  const withoutDiacritics = stripDiacritics(lower);
  const hyphenNormalized = withoutDiacritics
    .replace(/[^\w-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .trim();

  const candidates = [
    decoded,
    lower,
    withoutDiacritics,
    hyphenNormalized,
    slugifyModelStyle(decoded),
    slugifyModelStyle(lower),
    slugifyModelStyle(withoutDiacritics)
  ]
    .map((candidate) => candidate?.trim?.())
    .filter(Boolean);

  return Array.from(new Set(candidates));
};

const resolveParams = async (params) => {
  if (params && typeof params.then === 'function') {
    const resolved = await params;
    return resolved || {};
  }

  return params || {};
};

const findChaletBySlugIdentifier = async (value) => {
  if (!value) {
    return null;
  }

  if (mongoose.Types.ObjectId.isValid(value)) {
    const byId = await Chalet.findById(value);
    if (byId) {
      return byId;
    }
  }

  const slugCandidates = buildSlugCandidates(value);

  if (!slugCandidates.length) {
    return null;
  }

  let chalet = await Chalet.findOne({ slug: { $in: slugCandidates } });

  if (!chalet && slugCandidates.length) {
    const regexConditions = slugCandidates.map((candidate) => ({
      slug: { $regex: new RegExp(`^${escapeRegex(candidate)}$`, 'i') }
    }));

    if (regexConditions.length) {
      chalet = await Chalet.findOne({ $or: regexConditions });
    }
  }

  return chalet;
};

// Get single chalet by slug
export async function GET(request, context) {
  try {
    await dbConnect();

    const { slug } = await resolveParams(context?.params);
    const chalet = await findChaletBySlugIdentifier(slug);

    if (!chalet) {
      return NextResponse.json(
        {
          success: false,
          message: 'Chalet not found'
        },
        { status: 404 }
      );
    }

    // Increment view count
    await chalet.incrementViews();

    return NextResponse.json({
      success: true,
      data: chalet
    });
  } catch (error) {
    console.error('Error fetching chalet:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch chalet'
      },
      { status: 500 }
    );
  }
}

// Update chalet (protected)
export async function PUT(request, context) {
  const resolvedParams = await resolveParams(context?.params);

  return requireAuth(async (req) => {
    try {
      await dbConnect();

      const { slug } = resolvedParams;
      const existingChalet = await findChaletBySlugIdentifier(slug);

      if (!existingChalet) {
        return NextResponse.json(
          {
            success: false,
            message: 'Chalet not found'
          },
          { status: 404 }
        );
      }

      const body = await req.json();

      const chalet = await Chalet.findByIdAndUpdate(
        existingChalet._id,
        body,
        { new: true, runValidators: true }
      );

      if (!chalet) {
        return NextResponse.json(
          {
            success: false,
            message: 'Chalet not found'
          },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        message: 'Chalet updated successfully',
        data: chalet
      });
    } catch (error) {
      console.error('Error updating chalet:', error);

      if (error.name === 'ValidationError') {
        const errors = Object.values(error.errors).map((err) => err.message);
        return NextResponse.json(
          {
            success: false,
            message: 'Validation failed',
            errors
          },
          { status: 400 }
        );
      }

      return NextResponse.json(
        {
          success: false,
          message: 'Failed to update chalet'
        },
        { status: 500 }
      );
    }
  })(request);
}

export async function PATCH(request, context) {
  try {
    const authHeader = request.headers.get('authorization') || '';
    const token = authHeader.startsWith('Bearer ')
      ? authHeader.slice(7)
      : null;

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: 'Access token is required'
        },
        { status: 401 }
      );
    }

    let user;
    try {
      user = await verifyToken(token);
    } catch (error) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid or expired token'
        },
        { status: 401 }
      );
    }

    if (user?.role !== 'super-admin') {
      return NextResponse.json(
        {
          success: false,
          message: 'Insufficient permissions'
        },
        { status: 403 }
      );
    }

    await dbConnect();

    const { slug } = await resolveParams(context?.params);
    const existingChalet = await findChaletBySlugIdentifier(slug);

    if (!existingChalet) {
      return NextResponse.json(
        {
          success: false,
          message: 'Chalet not found'
        },
        { status: 404 }
      );
    }

    const body = await request.json();

    const updates = {};

    if (body?.availability?.isActive !== undefined) {
      updates['availability.isActive'] = body.availability.isActive;
    }

    for (const [key, value] of Object.entries(body || {})) {
      if (key !== 'availability') {
        updates[key] = value;
      }
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'No valid fields provided for update'
        },
        { status: 400 }
      );
    }

    const updatePayload = {};
    const directKeys = ['title', 'description', 'shortDescription', 'featured', 'pricing', 'location', 'images', 'amenities', 'specifications', 'availability', 'contact', 'seo'];

    for (const [key, value] of Object.entries(updates)) {
      if (key.includes('.')) {
        updatePayload.$set = { ...(updatePayload.$set || {}), [key]: value };
      } else if (directKeys.includes(key)) {
        updatePayload[key] = value;
      } else {
        updatePayload.$set = { ...(updatePayload.$set || {}), [key]: value };
      }
    }

    const chalet = await Chalet.findByIdAndUpdate(
      existingChalet._id,
      updatePayload,
      { new: true, runValidators: true }
    );

    if (!chalet) {
      return NextResponse.json(
        {
          success: false,
          message: 'Chalet not found'
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Chalet updated successfully',
      data: chalet
    });
  } catch (error) {
    console.error('Error partially updating chalet:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to update chalet'
      },
      { status: 500 }
    );
  }
}

// Delete chalet (protected)
export async function DELETE(request, context) {
  const resolvedParams = await resolveParams(context?.params);

  return requireAuth(async (req) => {
    try {
      await dbConnect();

      const { slug } = resolvedParams;
      const existingChalet = await findChaletBySlugIdentifier(slug);

      if (!existingChalet) {
        return NextResponse.json(
          {
            success: false,
            message: 'Chalet not found'
          },
          { status: 404 }
        );
      }

      const chalet = await Chalet.findByIdAndDelete(existingChalet._id);

      if (!chalet) {
        return NextResponse.json(
          {
            success: false,
            message: 'Chalet not found'
          },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        message: 'Chalet deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting chalet:', error);
      return NextResponse.json(
        {
          success: false,
          message: 'Failed to delete chalet'
        },
        { status: 500 }
      );
    }
  })(request);
}
