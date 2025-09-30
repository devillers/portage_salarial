import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '../../../lib/mongodb';
import Content from '../../../models/Content';
import { createFakeContent, describeConnection } from '../../../lib/seed/fakeContent';

function mapDatabaseStatus(connection, pingResult, contentCount) {
  const connectionInfo = describeConnection(connection);
  return {
    ...connectionInfo,
    ping: pingResult,
    contentCount
  };
}

export async function GET() {
  const siteStatus = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  };

  try {
    await dbConnect();
    const connection = mongoose.connection;

    let pingResult = false;
    try {
      const admin = await connection.db.admin().command({ ping: 1 });
      pingResult = admin?.ok === 1;
    } catch (error) {
      pingResult = false;
    }

    const contentCount = await Content.countDocuments();
    const database = mapDatabaseStatus(connection, pingResult, contentCount);

    return NextResponse.json({
      success: true,
      data: {
        site: siteStatus,
        database
      }
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Failed to retrieve system status',
      data: {
        site: siteStatus
      },
      error: error.message
    }, { status: 500 });
  }
}

export async function POST(request) {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({
      success: false,
      message: 'Fake content generation is disabled in production.'
    }, { status: 403 });
  }

  try {
    const payload = await request.json();
    const page = payload?.page || 'home';
    const count = payload?.count;
    const sections = payload?.sections;

    await dbConnect();
    const createdContent = await createFakeContent({ page, count, sections });

    return NextResponse.json({
      success: true,
      message: `Generated ${createdContent.length} fake content block${createdContent.length !== 1 ? 's' : ''}.`,
      data: createdContent
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Failed to generate fake content',
      error: error.message
    }, { status: 400 });
  }
}
