import mongoose from 'mongoose';

const PortfolioItemSchema = new mongoose.Schema({
  chalet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chalet',
    required: [true, 'Chalet reference is required']
  },
  featured: {
    type: Boolean,
    default: false
  },
  displayOrder: {
    type: Number,
    default: 0
  },
  customDescription: {
    type: String,
    maxlength: [500, 'Custom description cannot exceed 500 characters']
  },
  customImages: [{
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
  externalBookingUrl: {
    type: String,
    validate: {
      validator: function(v) {
        if (!v) return true;
        return /^https?:\/\/.+/.test(v);
      },
      message: 'External booking URL must be a valid URL'
    }
  },
  showOnPortfolio: {
    type: Boolean,
    default: true
  },
  seoTitle: {
    type: String,
    maxlength: [60, 'SEO title cannot exceed 60 characters']
  },
  seoDescription: {
    type: String,
    maxlength: [160, 'SEO description cannot exceed 160 characters']
  },
  tags: [{
    type: String,
    trim: true
  }],
  statistics: {
    views: {
      type: Number,
      default: 0
    },
    bookingClicks: {
      type: Number,
      default: 0
    },
    lastViewed: Date
  }
}, {
  timestamps: true
});

// Ensure only one featured item per chalet
PortfolioItemSchema.pre('save', async function(next) {
  if (this.featured && this.isModified('featured')) {
    await mongoose.model('PortfolioItem').updateMany(
      { chalet: this.chalet, _id: { $ne: this._id } },
      { featured: false }
    );
  }
  next();
});

// Increment view count
PortfolioItemSchema.methods.incrementViews = function() {
  this.statistics.views += 1;
  this.statistics.lastViewed = new Date();
  return this.save();
};

// Increment booking clicks
PortfolioItemSchema.methods.incrementBookingClicks = function() {
  this.statistics.bookingClicks += 1;
  return this.save();
};

// Get effective images (custom or from chalet)
PortfolioItemSchema.methods.getEffectiveImages = async function() {
  if (this.customImages && this.customImages.length > 0) {
    return this.customImages;
  }
  
  await this.populate('chalet');
  return this.chalet.images || [];
};

// Get effective description
PortfolioItemSchema.methods.getEffectiveDescription = async function() {
  if (this.customDescription) {
    return this.customDescription;
  }
  
  await this.populate('chalet');
  return this.chalet.shortDescription || this.chalet.description;
};

export default mongoose.models.PortfolioItem || mongoose.model('PortfolioItem', PortfolioItemSchema);