import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/mongodb';
import Chalet from '../../../../models/Chalet';
import { requireAuth } from '../../../../lib/auth';

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