import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/mongodb';
import Chalet from '../../../../models/Chalet';
import { requireAuth, verifyToken } from '../../../../lib/auth';

// Get single chalet by slug
export async function GET(request, { params }) {
  try {
    await dbConnect();

    const { slug } = params;
    const chalet = await Chalet.findOne({ slug });

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
export async function PUT(request, { params }) {
  return requireAuth(async (req) => {
    try {
      await dbConnect();

      const { slug } = params;
      const body = await req.json();

      const chalet = await Chalet.findOneAndUpdate(
        { slug },
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
          message: 'Failed to update chalet'
        },
        { status: 500 }
      );
    }
  })(request);
}

export async function PATCH(request, { params }) {
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

    const { slug } = params;
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

    const chalet = await Chalet.findOneAndUpdate(
      { slug },
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
export async function DELETE(request, { params }) {
  return requireAuth(async (req) => {
    try {
      await dbConnect();

      const { slug } = params;
      const chalet = await Chalet.findOneAndDelete({ slug });

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