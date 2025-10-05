import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongodb';
import Chalet from '../../../models/Chalet';
import SignupApplication from '../../../models/SignupApplication';
import { requireAuth, verifyToken } from '../../../lib/auth';

async function resolveOwnerFilter(request, ownerParam) {
  if (!ownerParam) return null;

  if (ownerParam === 'me') {
    const authHeader = request.headers.get('authorization') || '';
    const token = authHeader.startsWith('Bearer ')
      ? authHeader.slice(7)
      : null;

    if (!token) {
      return { error: NextResponse.json({ success: false, message: 'Authentication required' }, { status: 401 }) };
    }

    try {
      const user = await verifyToken(token);
      return { ownerId: user._id?.toString?.() ?? user.id?.toString?.() ?? user._id };
    } catch (error) {
      return { error: NextResponse.json({ success: false, message: 'Invalid or expired token' }, { status: 401 }) };
    }
  }

  return { ownerId: ownerParam };
}

// Get all chalets
export async function GET(request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const featured = searchParams.get('featured');
    const limit = searchParams.get('limit');
    const page = searchParams.get('page') || 1;
    const search = searchParams.get('search');
    const ownerParam = searchParams.get('owner');
    const includeInactive = searchParams.get('includeInactive') === 'true';
    const includeSignups = searchParams.get('includeSignups') === 'true';

    const authHeader = request.headers.get('authorization') || '';
    const token = authHeader.startsWith('Bearer ')
      ? authHeader.slice(7)
      : null;

    let authUser = null;
    if (token) {
      try {
        authUser = await verifyToken(token);
      } catch (error) {
        // ignore invalid token for public calls
        authUser = null;
      }
    }

    let query = {};

    const shouldFilterActiveOnly = !includeInactive || authUser?.role !== 'super-admin';
    if (shouldFilterActiveOnly) {
      query['availability.isActive'] = true;
    }

    // Filter by featured
    if (featured === 'true') {
      query.featured = true;
    }

    if (ownerParam) {
      const ownerResult = await resolveOwnerFilter(request, ownerParam);
      if (ownerResult?.error) {
        return ownerResult.error;
      }

      query.owner = ownerResult?.ownerId;
    }

    // Add search functionality
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { 'location.city': { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    let chaletQuery = Chalet.find(query).sort({ featured: -1, createdAt: -1 });

    // Apply pagination
    if (limit) {
      const skip = (page - 1) * parseInt(limit);
      chaletQuery = chaletQuery.skip(skip).limit(parseInt(limit));
    }

    const chalets = await chaletQuery.exec();
    const total = await Chalet.countDocuments(query);

    const chaletObjects = chalets.map((chalet) =>
      typeof chalet.toObject === 'function' ? chalet.toObject({ virtuals: true }) : chalet
    );

    let signupEntries = [];

    if (authUser?.role === 'super-admin' && includeSignups) {
      const ownerApplications = await SignupApplication.find({ type: 'owner' }).lean();

      signupEntries = ownerApplications.map((application) => {
        const ownerData = application.ownerData || {};
        const propertyAddress = ownerData.propertyAddress || {};
        const heroPhotoSource = ownerData.heroPhoto?.[0] || ownerData.gallery?.[0] || {};
        const gallerySources = Array.isArray(ownerData.gallery) ? ownerData.gallery : [];

        const toUrl = (file = {}) => file.secureUrl || file.url || '';

        return {
          _id: `signup-${application._id}`,
          slug: ownerData.slug || `signup-${application._id}`,
          title: ownerData.title || 'Nouveau chalet (inscription)',
          heroImage: toUrl(heroPhotoSource) || null,
          gallery: gallerySources.map((item) => toUrl(item)).filter(Boolean),
          location: {
            city: propertyAddress.city || '',
            country: propertyAddress.country || ''
          },
          availability: {
            isActive: false,
            status: 'pending-review'
          },
          source: 'signup-application',
          ownerApplicationId: application._id
        };
      });
    }

    const seenKeys = new Set();
    const combinedData = [];

    const registerEntry = (entry, { ownerKey = '', preferSlugOnly = false } = {}) => {
      const slugKey = entry.slug || '';
      const ownerKeyValue = ownerKey || '';

      let identifier;

      if (slugKey && preferSlugOnly) {
        identifier = `slug:${slugKey}`;
      } else if (slugKey && ownerKeyValue) {
        identifier = `slug:${slugKey}|owner:${ownerKeyValue}`;
      } else if (slugKey) {
        identifier = `slug:${slugKey}`;
      } else if (ownerKeyValue) {
        identifier = `owner:${ownerKeyValue}`;
      } else {
        identifier = `id:${entry._id || ''}`;
      }

      if (seenKeys.has(identifier)) {
        return false;
      }

      seenKeys.add(identifier);
      combinedData.push(entry);
      return true;
    };

    chaletObjects.forEach((chalet) => {
      const ownerKey = chalet.owner?._id?.toString?.() || chalet.owner?.toString?.() || '';
      registerEntry(chalet, { ownerKey });
    });

    let uniqueSignupCount = 0;

    signupEntries.forEach((entry) => {
      if (registerEntry(entry, { preferSlugOnly: true })) {
        uniqueSignupCount += 1;
      }
    });

    const totalCombined = total + uniqueSignupCount;

    return NextResponse.json({
      success: true,
      data: combinedData,
      pagination: {
        total: totalCombined,
        page: parseInt(page),
        limit: limit ? parseInt(limit) : totalCombined,
        pages: limit ? Math.ceil(totalCombined / parseInt(limit)) : 1
      }
    });

  } catch (error) {
    console.error('Error fetching chalets:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch chalets'
      },
      { status: 500 }
    );
  }
}

// Create new chalet (protected)
export async function POST(request) {
  return requireAuth(async (req) => {
    try {
      await dbConnect();

      const body = await req.json();
      const chalet = new Chalet(body);
      await chalet.save();

      return NextResponse.json({
        success: true,
        message: 'Chalet created successfully',
        data: chalet
      }, { status: 201 });

    } catch (error) {
      console.error('Error creating chalet:', error);
      
      if (error.name === 'ValidationError') {
        const errors = Object.values(error.errors).map(err => err.message);
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
          message: 'Failed to create chalet'
        },
        { status: 500 }
      );
    }
  })(request);
}