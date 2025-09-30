import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongodb';
import Content from '../../../models/Content';
import { requireAuth } from '../../../lib/auth';

// Get content by page and section
export async function GET(request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page');
    const section = searchParams.get('section');
    const published = searchParams.get('published') !== 'false';

    if (!page) {
      return NextResponse.json(
        {
          success: false,
          message: 'Page parameter is required'
        },
        { status: 400 }
      );
    }

    let content;
    if (published) {
      content = await Content.getPublishedContent(page, section);
    } else {
      const query = { page };
      if (section) query.section = section;
      
      content = await Content.find(query)
        .sort({ 'settings.displayOrder': 1, createdAt: 1 })
        .populate('createdBy', 'username')
        .populate('lastModifiedBy', 'username');
    }

    return NextResponse.json({
      success: true,
      data: content
    });

  } catch (error) {
    console.error('Error fetching content:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch content'
      },
      { status: 500 }
    );
  }
}

// Create new content (protected)
export async function POST(request) {
  return requireAuth(async (req) => {
    try {
      await dbConnect();

      const body = await req.json();
      const content = new Content({
        ...body,
        createdBy: req.user._id,
        lastModifiedBy: req.user._id
      });

      await content.save();
      await content.populate('createdBy', 'username');
      await content.populate('lastModifiedBy', 'username');

      return NextResponse.json({
        success: true,
        message: 'Content created successfully',
        data: content
      }, { status: 201 });

    } catch (error) {
      console.error('Error creating content:', error);
      
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
          message: 'Failed to create content'
        },
        { status: 500 }
      );
    }
  })(request);
}