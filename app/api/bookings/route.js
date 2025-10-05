import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongodb';
import Booking from '../../../models/Booking';
import Chalet from '../../../models/Chalet';
import { sendBookingConfirmation } from '../../../lib/email';
import { verifyToken } from '../../../lib/auth';

// Create new booking
export async function POST(request) {
  try {
    await dbConnect();

    const body = await request.json();
    const { chaletId, dates, guests, pricing, guest: guestInfo } = body;

    // Validate chalet exists and is available
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

    // Check availability
    const isAvailable = chalet.isAvailable(dates.checkIn, dates.checkOut);
    if (!isAvailable) {
      return NextResponse.json(
        {
          success: false,
          message: 'Chalet is not available for selected dates'
        },
        { status: 400 }
      );
    }

    // Create booking
    const booking = new Booking({
      chalet: chaletId,
      dates,
      guests,
      pricing,
      guest: guestInfo
    });

    await booking.save();

    // Populate chalet details for email
    await booking.populate('chalet');

    // Generate confirmation number
    const confirmationNumber = booking.generateConfirmationNumber();
    
    // Send confirmation email
    try {
      await sendBookingConfirmation({
        to: guestInfo.email,
        bookingDetails: {
          ...booking.toObject(),
          confirmationNumber
        },
        chaletDetails: chalet
      });
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError);
      // Don't fail the booking if email fails
    }

    return NextResponse.json({
      success: true,
      message: 'Booking created successfully',
      data: {
        ...booking.toObject(),
        confirmationNumber
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating booking:', error);
    
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
        message: 'Failed to create booking'
      },
      { status: 500 }
    );
  }
}

// Get bookings (with optional filtering)
export async function GET(request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const chaletId = searchParams.get('chaletId');
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const ownerParam = searchParams.get('owner');

    let query = {};

    if (chaletId) {
      query.chalet = chaletId;
    }

    if (status) {
      query.status = status;
    }

    if (ownerParam) {
      let ownerChaletIds = [];

      if (ownerParam === 'me') {
        const authHeader = request.headers.get('authorization') || '';
        const token = authHeader.startsWith('Bearer ')
          ? authHeader.slice(7)
          : null;

        if (!token) {
          return NextResponse.json(
            {
              success: false,
              message: 'Authentication required'
            },
            { status: 401 }
          );
        }

        try {
          const user = await verifyToken(token);
          const chalets = await Chalet.find({ owner: user._id }).select('_id');
          ownerChaletIds = chalets.map((chalet) => chalet._id.toString());
        } catch (error) {
          return NextResponse.json(
            {
              success: false,
              message: 'Invalid or expired token'
            },
            { status: 401 }
          );
        }
      } else {
        const chalets = await Chalet.find({ owner: ownerParam }).select('_id');
        ownerChaletIds = chalets.map((chalet) => chalet._id.toString());
      }

      if (ownerChaletIds.length === 0) {
        return NextResponse.json({
          success: true,
          data: [],
          pagination: {
            total: 0,
            page,
            limit,
            pages: 0
          }
        });
      }

      if (query.chalet) {
        if (!ownerChaletIds.includes(query.chalet.toString())) {
          return NextResponse.json({
            success: true,
            data: [],
            pagination: {
              total: 0,
              page,
              limit,
              pages: 0
            }
          });
        }
      } else {
        query.chalet = { $in: ownerChaletIds };
      }
    }

    const skip = (page - 1) * limit;

    const bookings = await Booking.find(query)
      .populate('chalet', 'title slug location')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Booking.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: bookings,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch bookings'
      },
      { status: 500 }
    );
  }
}