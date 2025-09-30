import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/mongodb';
import User from '../../../../models/User';
import { generateToken } from '../../../../lib/auth';

export async function POST(request) {
  try {
    await dbConnect();

    const body = await request.json();
    const { username, email, password, role = 'admin' } = body;

    // Validate required fields
    if (!username || !email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: 'Username, email, and password are required'
        },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [
        { username: username.toLowerCase() },
        { email: email.toLowerCase() }
      ]
    });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: 'User with this username or email already exists'
        },
        { status: 409 }
      );
    }

    // Create new user
    const user = new User({
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      password,
      role
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id);

    // Return user data (excluding password)
    const userData = {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt
    };

    return NextResponse.json({
      success: true,
      message: 'User created successfully',
      token,
      user: userData
    }, { status: 201 });

  } catch (error) {
    console.error('Registration error:', error);
    
    // Handle validation errors
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
        message: 'Internal server error'
      },
      { status: 500 }
    );
  }
}