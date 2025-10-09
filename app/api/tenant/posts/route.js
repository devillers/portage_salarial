import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/mongodb';
import Content from '../../../../models/Content';
import { verifyToken } from '../../../../lib/auth';

const PAGE_IDENTIFIER = 'tenant-posts';

const ALLOWED_CONTENT_TYPES = new Set(['text', 'html', 'markdown']);

async function authenticateTenant(request) {
  const authHeader = request.headers.get('authorization') || '';

  if (!authHeader.startsWith('Bearer ')) {
    return {
      error: NextResponse.json(
        {
          success: false,
          message: 'Authentication required'
        },
        { status: 401 }
      )
    };
  }

  const token = authHeader.slice(7).trim();

  if (!token) {
    return {
      error: NextResponse.json(
        {
          success: false,
          message: 'Authentication required'
        },
        { status: 401 }
      )
    };
  }

  try {
    const user = await verifyToken(token);
    const role = (user?.role || '').toString().trim().toLowerCase();

    if (role !== 'tenant') {
      return {
        error: NextResponse.json(
          {
            success: false,
            message: 'Tenant permissions required'
          },
          { status: 403 }
        )
      };
    }

    return { user };
  } catch (error) {
    return {
      error: NextResponse.json(
        {
          success: false,
          message: 'Invalid or expired token'
        },
        { status: 401 }
      )
    };
  }
}

function serialisePost(post) {
  if (!post) {
    return null;
  }

  const metadata = post.metadata || {};
  const settings = post.settings || {};

  return {
    id: post._id?.toString?.() ?? post.id ?? '',
    title: post.title || '',
    subtitle: metadata.subtitle || '',
    summary: metadata.description || '',
    content: post.content || '',
    contentType: post.contentType || 'text',
    isPublished: typeof settings.isPublished === 'boolean' ? settings.isPublished : true,
    createdAt: post.createdAt || null,
    updatedAt: post.updatedAt || null
  };
}

export async function GET(request) {
  await dbConnect();
  const { user, error } = await authenticateTenant(request);

  if (error) {
    return error;
  }

  const post = await Content.findOne({
    page: PAGE_IDENTIFIER,
    createdBy: user._id
  }).lean();

  return NextResponse.json({
    success: true,
    data: serialisePost(post)
  });
}

export async function PUT(request) {
  await dbConnect();
  const { user, error } = await authenticateTenant(request);

  if (error) {
    return error;
  }

  let payload;
  try {
    payload = await request.json();
  } catch (err) {
    return NextResponse.json(
      {
        success: false,
        message: 'Invalid JSON payload'
      },
      { status: 400 }
    );
  }

  const title = payload?.title?.toString().trim();
  const content = payload?.content?.toString();
  const subtitle = payload?.subtitle?.toString().trim() || '';
  const summary = payload?.summary?.toString().trim() || '';
  const isPublished = payload?.isPublished !== undefined ? Boolean(payload.isPublished) : undefined;
  const contentTypeCandidate = payload?.contentType?.toString().trim().toLowerCase();
  const contentType = ALLOWED_CONTENT_TYPES.has(contentTypeCandidate)
    ? contentTypeCandidate
    : 'markdown';

  if (!title) {
    return NextResponse.json(
      {
        success: false,
        message: 'Title is required'
      },
      { status: 400 }
    );
  }

  if (!content || !content.trim()) {
    return NextResponse.json(
      {
        success: false,
        message: 'Content is required'
      },
      { status: 400 }
    );
  }

  let post = await Content.findOne({
    page: PAGE_IDENTIFIER,
    createdBy: user._id
  });

  const isNewPost = !post;

  if (!post) {
    post = new Content({
      page: PAGE_IDENTIFIER,
      section: 'main',
      title,
      content,
      contentType,
      metadata: {
        subtitle,
        description: summary,
        author: user.username || user.email || '',
        publishDate: new Date(),
        lastModified: new Date()
      },
      settings: {
        isPublished: isPublished !== undefined ? isPublished : true,
        showTitle: true,
        allowComments: false,
        featured: false,
        displayOrder: 0
      },
      createdBy: user._id,
      lastModifiedBy: user._id
    });
  } else {
    post.title = title;
    post.content = content;
    post.contentType = contentType;
    post.lastModifiedBy = user._id;

    post.metadata = {
      ...(post.metadata || {}),
      subtitle,
      description: summary,
      author: post.metadata?.author || user.username || user.email || '',
      lastModified: new Date()
    };

    if (isPublished !== undefined) {
      post.settings = {
        ...(post.settings || {}),
        isPublished
      };
    }
  }

  try {
    await post.save();
    await post.populate('createdBy', 'username');
    await post.populate('lastModifiedBy', 'username');
  } catch (err) {
    return NextResponse.json(
      {
        success: false,
        message: err?.message || 'Failed to save post'
      },
      { status: 400 }
    );
  }

  const responsePayload = serialisePost(post.toObject?.() ?? post);

  return NextResponse.json(
    {
      success: true,
      message: isNewPost ? 'Post created successfully' : 'Post updated successfully',
      data: responsePayload
    },
    { status: isNewPost ? 201 : 200 }
  );
}
