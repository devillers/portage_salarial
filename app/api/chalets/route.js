import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongodb';
import Chalet from '../../../models/Chalet';
import { requireAuth } from '../../../lib/auth';

// Get all chalets
export async function GET(request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const featured = searchParams.get('featured');
    const limit = searchParams.get('limit');
    const page = searchParams.get('page') || 1;
    const search = searchParams.get('search');

    let query = { 'availability.isActive': true };

    // Filter by featured
    if (featured === 'true') {
      query.featured = true;
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

    return NextResponse.json({
      success: true,
      data: chalets,
      pagination: {
        total,
        page: parseInt(page),
        limit: limit ? parseInt(limit) : total,
        pages: limit ? Math.ceil(total / parseInt(limit)) : 1
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