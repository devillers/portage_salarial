import mongoose from 'mongoose';

const ContentSchema = new mongoose.Schema({
  page: {
    type: String,
    required: [true, 'Page identifier is required'],
    enum: ['home', 'services', 'portfolio', 'portage-salarial', 'seminaires-evenements', 'contact'],
    index: true
  },
  section: {
    type: String,
    required: [true, 'Section identifier is required'],
    trim: true
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  content: {
    type: String,
    required: [true, 'Content is required']
  },
  contentType: {
    type: String,
    enum: ['text', 'html', 'markdown'],
    default: 'text'
  },
  metadata: {
    subtitle: String,
    description: String,
    keywords: [String],
    author: String,
    publishDate: Date,
    lastModified: Date
  },
  media: [{
    type: {
      type: String,
      enum: ['image', 'video', 'document'],
      required: true
    },
    url: {
      type: String,
      required: true
    },
    alt: String,
    caption: String,
    title: String
  }],
  settings: {
    isPublished: {
      type: Boolean,
      default: true
    },
    showTitle: {
      type: Boolean,
      default: true
    },
    allowComments: {
      type: Boolean,
      default: false
    },
    featured: {
      type: Boolean,
      default: false
    },
    displayOrder: {
      type: Number,
      default: 0
    }
  },
  seo: {
    metaTitle: {
      type: String,
      maxlength: [60, 'Meta title cannot exceed 60 characters']
    },
    metaDescription: {
      type: String,
      maxlength: [160, 'Meta description cannot exceed 160 characters']
    },
    canonicalUrl: String,
    noIndex: {
      type: Boolean,
      default: false
    }
  },
  version: {
    type: Number,
    default: 1
  },
  history: [{
    version: Number,
    content: String,
    modifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    modifiedAt: {
      type: Date,
      default: Date.now
    },
    changeNote: String
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  lastModifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Compound index for efficient queries
ContentSchema.index({ page: 1, section: 1 });
ContentSchema.index({ 'settings.isPublished': 1, 'settings.displayOrder': 1 });

// Update version and history before saving
ContentSchema.pre('save', function(next) {
  if (this.isModified('content') && !this.isNew) {
    // Save to history
    this.history.push({
      version: this.version,
      content: this.content,
      modifiedBy: this.lastModifiedBy,
      modifiedAt: new Date(),
      changeNote: 'Content updated'
    });
    
    // Increment version
    this.version += 1;
  }
  
  // Update metadata
  this.metadata.lastModified = new Date();
  
  next();
});

// Static method to get published content for a page
ContentSchema.statics.getPublishedContent = function(page, section = null) {
  const query = { 
    page, 
    'settings.isPublished': true 
  };
  
  if (section) {
    query.section = section;
  }
  
  return this.find(query)
    .sort({ 'settings.displayOrder': 1, createdAt: 1 })
    .populate('createdBy', 'username')
    .populate('lastModifiedBy', 'username');
};

// Instance method to create a backup
ContentSchema.methods.createBackup = function(userId, note = '') {
  this.history.push({
    version: this.version,
    content: this.content,
    modifiedBy: userId,
    modifiedAt: new Date(),
    changeNote: note || 'Manual backup'
  });
  
  return this.save();
};

// Instance method to restore from history
ContentSchema.methods.restoreFromHistory = function(historyIndex, userId) {
  if (historyIndex >= 0 && historyIndex < this.history.length) {
    const historicalContent = this.history[historyIndex];
    
    // Create backup of current content
    this.createBackup(userId, 'Before restore');
    
    // Restore content
    this.content = historicalContent.content;
    this.lastModifiedBy = userId;
    this.version += 1;
    
    return this.save();
  }
  
  throw new Error('Invalid history index');
};

export default mongoose.models.Content || mongoose.model('Content', ContentSchema);