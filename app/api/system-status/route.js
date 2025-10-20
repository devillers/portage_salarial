import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '../../../lib/mongodb';
import Content from '../../../models/Content';
function describeConnection(connection) {
  if (!connection) {
    return {
      state: 'disconnected',
      host: null,
      port: null,
      name: null
    };
  }

  return {
    state: connection.readyState,
    host: connection.host ?? null,
    port: connection.port ?? null,
    name: connection.name ?? null
  };
}

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

export async function POST() {
  return NextResponse.json({
    success: false,
    message: 'Fake content generation endpoint has been removed.'
  }, { status: 410 });
}
