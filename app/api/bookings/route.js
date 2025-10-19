import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongodb';
import Booking from '../../../models/Booking';
import Chalet from '../../../models/Chalet';
import { sendBookingConfirmation } from '../../../lib/email';
import { verifyToken } from '../../../lib/auth';
import { ApiError } from '../../../lib/api-error';
import { createApiHandler } from '../../../lib/api-handler';
import { createRateLimiter, applyRateLimitHeaders } from '../../../lib/rateLimiter';
import logger from '../../../lib/logger';

const bookingSubmissionLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 5,
  keyPrefix: 'booking-post'
});

function collectMissingBookingFields({ chaletId, dates, guest }) {
  const missing = [];

  if (!chaletId) missing.push('chaletId');
  if (!dates?.checkIn) missing.push('dates.checkIn');
  if (!dates?.checkOut) missing.push('dates.checkOut');
  if (!guest?.email) missing.push('guest.email');

  return missing;
}

async function handleCreateBooking(request) {
  const rateLimitResult = await bookingSubmissionLimiter.check(request);

  if (!rateLimitResult.success) {
    return NextResponse.json(
      {
        success: false,
        message: 'Too many booking attempts. Please try again later.'
      },
      {
        status: 429,
        headers: rateLimitResult.headers
      }
    );
  }

  await dbConnect();

  const body = await request.json();
  const { chaletId, dates, guests, pricing, guest: guestInfo } = body ?? {};

  const missingFields = collectMissingBookingFields({ chaletId, dates, guest: guestInfo });
  if (missingFields.length > 0) {
    throw new ApiError('Missing required booking information', 400, { details: missingFields });
  }

  const chalet = await Chalet.findById(chaletId);
  if (!chalet) {
    throw new ApiError('Chalet not found', 404);
  }

  const isAvailable = chalet.isAvailable(dates.checkIn, dates.checkOut);
  if (!isAvailable) {
    throw new ApiError('Chalet is not available for selected dates', 400);
  }

  const booking = new Booking({
    chalet: chaletId,
    dates,
    guests,
    pricing,
    guest: guestInfo
  });

  await booking.save();
  await booking.populate('chalet');

  const confirmationNumber = booking.generateConfirmationNumber();

  try {
    await sendBookingConfirmation({
      to: guestInfo.email,
      bookingDetails: {
        ...booking.toObject(),
        confirmationNumber
      },
      chaletDetails: chalet
    });
  } catch (error) {
    logger.warn(
      {
        error,
        bookingId: booking._id,
        guestEmail: guestInfo.email
      },
      'Failed to send confirmation email'
    );
  }

  const response = NextResponse.json(
    {
      success: true,
      message: 'Booking created successfully',
      data: {
        ...booking.toObject(),
        confirmationNumber
      }
    },
    { status: 201 }
  );

  return applyRateLimitHeaders(response, rateLimitResult);
}

async function handleGetBookings(request) {
  await dbConnect();

  const { searchParams } = new URL(request.url);
  const chaletId = searchParams.get('chaletId');
  const status = searchParams.get('status');
  const page = parseInt(searchParams.get('page'), 10) || 1;
  const limit = parseInt(searchParams.get('limit'), 10) || 10;
  const ownerParam = searchParams.get('owner');

  const query = {};

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
        throw new ApiError('Authentication required', 401);
      }

      try {
        const user = await verifyToken(token);
        const chalets = await Chalet.find({ owner: user._id }).select('_id');
        ownerChaletIds = chalets.map((chalet) => chalet._id.toString());
      } catch (error) {
        throw new ApiError('Invalid or expired token', 401);
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
}

export const POST = createApiHandler(handleCreateBooking, {
  logMessage: 'Error creating booking',
  defaultMessage: 'Failed to create booking'
});

export const GET = createApiHandler(handleGetBookings, {
  logMessage: 'Error fetching bookings',
  defaultMessage: 'Failed to fetch bookings'
});
