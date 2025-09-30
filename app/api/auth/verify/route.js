import { NextResponse } from 'next/server';
import { verifyToken } from '../../../../lib/auth';

export async function GET(request) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: 'No token provided'
        },
        { status: 401 }
      );
    }

    const user = await verifyToken(token);

    return NextResponse.json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        lastLogin: user.lastLogin
      }
    });

  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error.message
      },
      { status: 401 }
    );
  }
}