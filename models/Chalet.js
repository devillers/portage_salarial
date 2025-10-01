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
    unique: true,
    lowercase: true,
    trim: true
    // ✅ slug n’est plus "required"
  },
  description: {
    type: String,
    required: true,
    maxlength: 2000
  },
  shortDescription: {
    type: String,
    required: true,
    maxlength: 200
  },
  images: {
    hero: {
      url: { type: String, required: true },
      alt: { type: String, required: true },
      caption: String
    },
    gallery: [
      {
        url: { type: String, required: true },
        alt: { type: String, required: true },
        caption: String
      }
    ]
  },
  amenities: [
    {
      name: { type: String, required: true },
      icon: String,
      description: String
    }
  ],
  specifications: {
    bedrooms: { type: Number, required: true, min: 1 },
    bathrooms: { type: Number, required: true, min: 1 },
    maxGuests: { type: Number, required: true, min: 1 },
    area: { type: Number, min: 10 },
    floors: { type: Number, default: 1 }
  },
  location: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    country: { type: String, required: true },
    postalCode: String,
    coordinates: {
      latitude: { type: Number, required: true, min: -90, max: 90 },
      longitude: { type: Number, required: true, min: -180, max: 180 }
    }
  },
  pricing: {
    basePrice: { type: Number, required: true, min: 0 },
    currency: { type: String, default: 'EUR', enum: ['EUR', 'USD', 'GBP'] },
    cleaningFee: { type: Number, default: 0, min: 0 },
    securityDeposit: { type: Number, default: 0, min: 0 },
    taxRate: { type: Number, default: 0, min: 0, max: 100 }
  },
  availability: {
    isActive: { type: Boolean, default: true },
    minimumStay: { type: Number, default: 1, min: 1 },
    maximumStay: { type: Number, default: 365 },
    checkInTime: { type: String, default: '15:00' },
    checkOutTime: { type: String, default: '11:00' },
    blockedDates: [
      {
        start: Date,
        end: Date,
        reason: String
      }
    ]
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
  featured: { type: Boolean, default: false },
  views: { type: Number, default: 0 }
}, {
  timestamps: true
});

// ✅ Génération automatique du slug
ChaletSchema.pre('save', function (next) {
  if (this.isModified('title') || this.isNew) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^\w ]+/g, '')
      .replace(/ +/g, '-')
      .trim();
  }
  next();
});

ChaletSchema.methods.incrementViews = function () {
  this.views += 1;
  return this.save();
};

ChaletSchema.methods.getHeroImage = function () {
  return this.images.hero;
};

ChaletSchema.methods.isAvailable = function (startDate, endDate) {
  if (!this.availability.isActive) return false;

  const start = new Date(startDate);
  const end = new Date(endDate);

  return !this.availability.blockedDates.some(blocked => {
    const blockedStart = new Date(blocked.start);
    const blockedEnd = new Date(blocked.end);
    return (start <= blockedEnd && end >= blockedStart);
  });
};

export default mongoose.models.Chalet || mongoose.model('Chalet', ChaletSchema);
