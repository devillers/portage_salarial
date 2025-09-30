// /app/api/auth/verify/route.js
import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// (facultatif) CORS si appelé depuis un autre domaine
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, content-type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

export async function GET(request) {
  try {
    const auth = request.headers.get('authorization') || '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7).trim() : '';

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'No token provided' },
        { status: 401, headers: corsHeaders }
      );
    }

    // verifyToken doit tourner côté Node (jsonwebtoken, crypto, etc.)
    const user = await verifyToken(token);
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Invalid token' },
        { status: 401, headers: corsHeaders }
      );
    }

    return NextResponse.json(
      {
        success: true,
        user: {
          id: user._id ?? user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          lastLogin: user.lastLogin ?? null,
        },
      },
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    // Évite de divulguer l’erreur exacte en prod
    return NextResponse.json(
      { success: false, message: 'Unauthorized' },
      { status: 401, headers: corsHeaders }
    );
  }
}
