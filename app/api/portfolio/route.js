import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongodb';
import PortfolioItem from '../../../models/PortfolioItem';
import Chalet from '../../../models/Chalet';
import { requireAuth } from '../../../lib/auth';

// Get all portfolio items
export async function GET(request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const featured = searchParams.get('featured');
    const limit = searchParams.get('limit');
    const page = searchParams.get('page') || 1;

    let query = { showOnPortfolio: true };

    // Filter by featured
    if (featured === 'true') {
      query.featured = true;
    }

    let portfolioQuery = PortfolioItem.find(query)
      .populate({
        path: 'chalet',
        match: { 'availability.isActive': true }
      })
      .sort({ featured: -1, displayOrder: 1, createdAt: -1 });

    // Apply pagination
    if (limit) {
      const skip = (page - 1) * parseInt(limit);
      portfolioQuery = portfolioQuery.skip(skip).limit(parseInt(limit));
    }

    const portfolioItems = await portfolioQuery.exec();
    
    // Filter out items where chalet is null (inactive chalets)
    const activePortfolioItems = portfolioItems.filter(item => item.chalet);

    const total = await PortfolioItem.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: activePortfolioItems,
      pagination: {
        total,
        page: parseInt(page),
        limit: limit ? parseInt(limit) : total,
        pages: limit ? Math.ceil(total / parseInt(limit)) : 1
      }
    });

  } catch (error) {
    console.error('Error fetching portfolio items:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch portfolio items'
      },
      { status: 500 }
    );
  }
}

// Create new portfolio item (protected)
export async function POST(request) {
  return requireAuth(async (req) => {
    try {
      await dbConnect();

      const body = await req.json();
      const { chaletId, ...portfolioData } = body;

      // Verify chalet exists
      const chalet = await Chalet.findById(chaletId);
      if (!chalet) {
        return NextResponse.json(
          {
            success: false,
            message: 'Chalet not found'
          },
          { status: 404 }
        );
      }

      // Check if portfolio item already exists for this chalet
      const existingItem = await PortfolioItem.findOne({ chalet: chaletId });
      if (existingItem) {
        return NextResponse.json(
          {
            success: false,
            message: 'Portfolio item already exists for this chalet'
          },
          { status: 409 }
        );
      }

      const portfolioItem = new PortfolioItem({
        chalet: chaletId,
        ...portfolioData
      });

      await portfolioItem.save();
      await portfolioItem.populate('chalet');

      return NextResponse.json({
        success: true,
        message: 'Portfolio item created successfully',
        data: portfolioItem
      }, { status: 201 });

    } catch (error) {
      console.error('Error creating portfolio item:', error);
      
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
          message: 'Failed to create portfolio item'
        },
        { status: 500 }
      );
    }
  })(request);
}