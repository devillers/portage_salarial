import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '../../../../lib/mongodb';
import User from '../../../../models/User';
import SignupApplication from '../../../../models/SignupApplication';
import { generateToken } from '../../../../lib/auth';

const MAX_USERNAME_LENGTH = 30;

const normaliseIdentifier = (value) =>
  (value || '')
    .toString()
    .trim()
    .toLowerCase();

const sanitiseUsername = (value) => {
  const base = (value || '')
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '.')
    .replace(/^\.+|\.+$/g, '');

  if (base.length >= 3) {
    return base.slice(0, MAX_USERNAME_LENGTH);
  }

  return 'tenant';
};

async function generateTenantUsername(email) {
  const [localPart] = (email || '').split('@');
  const sanitisedBase = sanitiseUsername(localPart);
  let candidate = sanitisedBase;
  let suffix = 0;

  while (await User.exists({ username: candidate })) {
    suffix += 1;
    const suffixString = suffix.toString();
    const baseLength = Math.max(0, MAX_USERNAME_LENGTH - suffixString.length);
    const base = (sanitisedBase || 'tenant').slice(0, baseLength) || 'tenant';
    candidate = `${base}${suffixString}`;
  }

  return candidate;
}

export async function POST(request) {
  try {
    await dbConnect();

    const body = await request.json();
    const { username, password } = body;
    const normalisedUsername = normaliseIdentifier(username);

    // Validate required fields
    if (!normalisedUsername || !password) {
      return NextResponse.json(
        {
          success: false,
          message: 'Username and password are required'
        },
        { status: 400 }
      );
    }

    // Find user with password field included
    let user = await User.findOne({
      $or: [
        { username: normalisedUsername },
        { email: normalisedUsername }
      ]
    }).select('+password');

    let createdTenantUser = false;

    if (!user) {
      const tenantApplication = await SignupApplication.findOne({
        type: 'tenant',
        'tenantData.email': normalisedUsername
      });

      if (tenantApplication?.tenantData?.password) {
        const passwordMatches = await bcrypt.compare(
          password,
          tenantApplication.tenantData.password
        );

        if (passwordMatches) {
          const tenantUsername = await generateTenantUsername(normalisedUsername);

          const tenantUser = new User({
            username: tenantUsername,
            email: normalisedUsername,
            password,
            role: 'tenant',
            isOwner: false,
            isActive: true
          });

          await tenantUser.save();
          user = await User.findById(tenantUser._id).select('+password');
          createdTenantUser = true;
        }
      }
    }

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid credentials'
        },
        { status: 401 }
      );
    }

    // Check if user is active
    if (!user.isActive) {
      return NextResponse.json(
        {
          success: false,
          message: 'Account is deactivated'
        },
        { status: 401 }
      );
    }

    // Compare password
    const isValidPassword = createdTenantUser
      ? true
      : await user.comparePassword(password);
    if (!isValidPassword) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid credentials'
        },
        { status: 401 }
      );
    }

    const allowedRoles = new Set(['admin', 'super-admin', 'owner', 'tenant']);
    const normalizedRole = (user.role || '').toString().trim().toLowerCase();
    const effectiveRole = user.isOwner
      ? 'owner'
      : normalizedRole || (user.isOwner ? 'owner' : '');

    if (!allowedRoles.has(effectiveRole)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Access denied'
        },
        { status: 403 }
      );
    }

    // Update last login
    await user.updateLastLogin();

    // Generate token
    const token = generateToken(user._id);

    // Return user data (excluding password)
    const userData = {
      id: user._id,
      username: user.username,
      email: user.email,
      role: effectiveRole || user.role,
      isOwner: effectiveRole === 'owner' ? true : user.isOwner,
      lastLogin: user.lastLogin
    };

    return NextResponse.json({
      success: true,
      message: 'Login successful',
      token,
      user: userData
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error'
      },
      { status: 500 }
    );
  }
}