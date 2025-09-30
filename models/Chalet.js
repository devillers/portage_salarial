import mongoose from 'mongoose';

const ChaletSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Chalet title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  shortDescription: {
    type: String,
    required: [true, 'Short description is required'],
    maxlength: [200, 'Short description cannot exceed 200 characters']
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    alt: {
      type: String,
      required: true
    },
    caption: String,
    isHero: {
      type: Boolean,
      default: false
    }
  }],
  amenities: [{
    name: {
      type: String,
      required: true
    },
    icon: String,
    description: String
  }],
  specifications: {
    bedrooms: {
      type: Number,
      required: true,
      min: [1, 'Must have at least 1 bedroom']
    },
    bathrooms: {
      type: Number,
      required: true,
      min: [1, 'Must have at least 1 bathroom']
    },
    maxGuests: {
      type: Number,
      required: true,
      min: [1, 'Must accommodate at least 1 guest']
    },
    area: {
      type: Number, // in square meters
      min: [10, 'Area must be at least 10 square meters']
    },
    floors: {
      type: Number,
      default: 1
    }
  },
  location: {
    address: {
      type: String,
      required: [true, 'Address is required']
    },
    city: {
      type: String,
      required: [true, 'City is required']
    },
    country: {
      type: String,
      required: [true, 'Country is required']
    },
    postalCode: String,
    coordinates: {
      latitude: {
        type: Number,
        required: [true, 'Latitude is required'],
        min: [-90, 'Latitude must be between -90 and 90'],
        max: [90, 'Latitude must be between -90 and 90']
      },
      longitude: {
        type: Number,
        required: [true, 'Longitude is required'],
        min: [-180, 'Longitude must be between -180 and 180'],
        max: [180, 'Longitude must be between -180 and 180']
      }
    }
  },
  pricing: {
    basePrice: {
      type: Number,
      required: [true, 'Base price is required'],
      min: [0, 'Price cannot be negative']
    },
    currency: {
      type: String,
      default: 'EUR',
      enum: ['EUR', 'USD', 'GBP']
    },
    cleaningFee: {
      type: Number,
      default: 0,
      min: [0, 'Cleaning fee cannot be negative']
    },
    securityDeposit: {
      type: Number,
      default: 0,
      min: [0, 'Security deposit cannot be negative']
    },
    taxRate: {
      type: Number,
      default: 0,
      min: [0, 'Tax rate cannot be negative'],
      max: [100, 'Tax rate cannot exceed 100%']
    }
  },
  availability: {
    isActive: {
      type: Boolean,
      default: true
    },
    minimumStay: {
      type: Number,
      default: 1,
      min: [1, 'Minimum stay must be at least 1 night']
    },
    maximumStay: {
      type: Number,
      default: 365
    },
    checkInTime: {
      type: String,
      default: '15:00'
    },
    checkOutTime: {
      type: String,
      default: '11:00'
    },
    blockedDates: [{
      start: Date,
      end: Date,
      reason: String
    }]
  },
  contact: {
    phone: String,
    email: String,
    website: String
  },
  seo: {
    metaTitle: String,
    metaDescription: String,
    keywords: [String]
  },
  featured: {
    type: Boolean,
    default: false
  },
  views: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Create URL-friendly slug from title
ChaletSchema.pre('save', function(next) {
  if (this.isModified('title') || this.isNew) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^\w ]+/g, '')
      .replace(/ +/g, '-')
      .trim();
  }
  next();
});

// Increment view count
ChaletSchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save();
};

// Get hero image
ChaletSchema.methods.getHeroImage = function() {
  const heroImage = this.images.find(img => img.isHero);
  return heroImage || this.images[0];
};

// Check availability for date range
ChaletSchema.methods.isAvailable = function(startDate, endDate) {
  if (!this.availability.isActive) return false;
  
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  // Check against blocked dates
  return !this.availability.blockedDates.some(blocked => {
    const blockedStart = new Date(blocked.start);
    const blockedEnd = new Date(blocked.end);
    return (start <= blockedEnd && end >= blockedStart);
  });
};

export default mongoose.models.Chalet || mongoose.model('Chalet', ChaletSchema);