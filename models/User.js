import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const ROLE_VALUES = ['admin', 'super-admin', 'manager', 'owner'];
const ADMIN_ROLES = new Set(['admin', 'super-admin', 'owner']);

const normalizeRole = (role) => {
  const normalized = (role || '').toString().trim().toLowerCase();

  if (normalized === 'owner') {
    return 'owner';
  }

  if (normalized === 'super-admin') {
    return 'super-admin';
  }

  if (normalized === 'manager') {
    return 'manager';
  }

  return 'admin';
};

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters long'],
    maxlength: [30, 'Username cannot exceed 30 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long'],
    select: false // Don't include password in queries by default
  },
  role: {
    type: String,
    enum: ROLE_VALUES,
    default: 'admin',
    set: normalizeRole
  },
  isOwner: {
    type: Boolean,
    default: false
  },
  chalets: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Chalet'
    }
  ],
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

UserSchema.pre('validate', function(next) {
  this.isOwner = normalizeRole(this.role) === 'owner';
  next();
});

// Hash password before saving
UserSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();
  
  try {
    // Hash password with cost of 12
    const hashedPassword = await bcrypt.hash(this.password, 12);
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Update last login
UserSchema.methods.updateLastLogin = function() {
  this.lastLogin = new Date();
  return this.save();
};

UserSchema.methods.hasAdminAccess = function() {
  return ADMIN_ROLES.has(this.role);
};

UserSchema.virtual('isAdminRole').get(function() {
  return ADMIN_ROLES.has(this.role);
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
