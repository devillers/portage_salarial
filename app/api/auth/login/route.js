import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/mongodb';
import User from '../../../../models/User';
import { generateToken } from '../../../../lib/auth';

export async function POST(request) {
  try {
    await dbConnect();

    const body = await request.json();
    const { username, password } = body;

    // Validate required fields
    if (!username || !password) {
      return NextResponse.json(
        {
          success: false,
          message: 'Username and password are required'
        },
        { status: 400 }
      );
    }

    // Find user with password field included
    const user = await User.findOne({ 
      $or: [
        { username: username.toLowerCase() },
        { email: username.toLowerCase() }
      ]
    }).select('+password');

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
    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid credentials'
        },
        { status: 401 }
      );
    }

    const allowedRoles = ['admin', 'super-admin', 'owner'];
    const normalizedRole = (user.role || '').toString().trim().toLowerCase();
    const effectiveRole = normalizedRole || (user.isOwner ? 'owner' : '');

    if (!allowedRoles.includes(effectiveRole)) {
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