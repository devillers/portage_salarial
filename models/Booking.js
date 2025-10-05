import mongoose from 'mongoose';

const BookingSchema = new mongoose.Schema({
  chalet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chalet',
    required: [true, 'Chalet reference is required']
  },
  guest: {
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
      maxlength: [50, 'First name cannot exceed 50 characters']
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
      maxlength: [50, 'Last name cannot exceed 50 characters']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true
    },
    address: {
      street: String,
      city: String,
      postalCode: String,
      country: String
    }
  },
  dates: {
    checkIn: {
      type: Date,
      required: [true, 'Check-in date is required']
    },
    checkOut: {
      type: Date,
      required: [true, 'Check-out date is required']
    },
    nights: {
      type: Number,
      required: true
    }
  },
  guests: {
    adults: {
      type: Number,
      required: [true, 'Number of adult guests is required'],
      min: [1, 'Must have at least 1 adult guest']
    },
    children: {
      type: Number,
      default: 0,
      min: [0, 'Number of children cannot be negative']
    },
    total: {
      type: Number,
      required: true
    }
  },
  pricing: {
    baseAmount: {
      type: Number,
      required: true,
      min: [0, 'Base amount cannot be negative']
    },
    cleaningFee: {
      type: Number,
      default: 0,
      min: [0, 'Cleaning fee cannot be negative']
    },
    taxes: {
      type: Number,
      default: 0,
      min: [0, 'Taxes cannot be negative']
    },
    totalAmount: {
      type: Number,
      required: true,
      min: [0, 'Total amount cannot be negative']
    },
    currency: {
      type: String,
      default: 'EUR',
      enum: ['EUR', 'USD', 'GBP']
    }
  },
  payment: {
    stripePaymentIntentId: String,
    stripeSessionId: String,
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed', 'refunded', 'cancelled'],
      default: 'pending'
    },
    method: {
      type: String,
      enum: ['card', 'bank_transfer', 'other'],
      default: 'card'
    },
    paidAt: Date,
    refundedAt: Date,
    refundAmount: Number
  },
  status: {
    type: String,
    enum: ['draft', 'confirmed', 'checked_in', 'checked_out', 'cancelled', 'no_show'],
    default: 'draft'
  },
  specialRequests: {
    type: String,
    maxlength: [1000, 'Special requests cannot exceed 1000 characters']
  },
  communication: [{
    date: {
      type: Date,
      default: Date.now
    },
    type: {
      type: String,
      enum: ['email', 'phone', 'sms', 'other'],
      default: 'email'
    },
    subject: String,
    message: String,
    sender: {
      type: String,
      enum: ['guest', 'admin', 'owner', 'system'],
      default: 'system'
    }
  }],
  cancellation: {
    cancelledAt: Date,
    reason: String,
    refundAmount: Number,
    cancelledBy: {
      type: String,
      enum: ['guest', 'admin', 'owner', 'system']
    }
  }
}, {
  timestamps: true
});

// Calculate nights between dates
BookingSchema.pre('save', function(next) {
  if (this.isModified('dates.checkIn') || this.isModified('dates.checkOut')) {
    const checkIn = new Date(this.dates.checkIn);
    const checkOut = new Date(this.dates.checkOut);
    const timeDiff = checkOut.getTime() - checkIn.getTime();
    this.dates.nights = Math.ceil(timeDiff / (1000 * 3600 * 24));
    this.guests.total = this.guests.adults + this.guests.children;
  }
  next();
});

// Generate booking confirmation number
BookingSchema.methods.generateConfirmationNumber = function() {
  const prefix = 'CHB';
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
};

// Check if booking is cancellable
BookingSchema.methods.isCancellable = function() {
  const now = new Date();
  const checkIn = new Date(this.dates.checkIn);
  const hoursUntilCheckIn = (checkIn.getTime() - now.getTime()) / (1000 * 60 * 60);
  
  // Allow cancellation up to 24 hours before check-in
  return hoursUntilCheckIn > 24 && this.status === 'confirmed';
};

// Get booking duration in days
BookingSchema.methods.getDuration = function() {
  return this.dates.nights;
};

export default mongoose.models.Booking || mongoose.model('Booking', BookingSchema);