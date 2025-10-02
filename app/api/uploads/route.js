import { NextResponse } from 'next/server';
import { createSignature, getCloudinaryConfig } from '../../../lib/cloudinary';

export const runtime = 'nodejs';

const sanitizeFolder = (folder) => {
  if (typeof folder !== 'string') {
    return '';
  }

  return folder
    .split('/')
    .map((segment) => segment.trim().replace(/[^a-zA-Z0-9-_]/g, ''))
    .filter(Boolean)
    .join('/');
};

const bufferFromFile = async (file) => {
  if (!file || typeof file.arrayBuffer !== 'function') {
    throw new Error('Invalid file received.');
  }

  const arrayBuffer = await file.arrayBuffer();
  return Buffer.from(arrayBuffer);
};

const uploadToCloudinary = async (file, { folder }) => {
  const config = getCloudinaryConfig();

  if (!config.isConfigured) {
    throw new Error('Cloudinary n\'est pas configuré.');
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const normalizedFolder = sanitizeFolder(folder);
  const targetFolder = [config.baseFolder, normalizedFolder].filter(Boolean).join('/');

  const signature = createSignature({
    folder: targetFolder,
    timestamp
  });

  const body = new FormData();
  const fileBuffer = await bufferFromFile(file);

  body.append('file', new Blob([fileBuffer]), file.name || 'upload');
  body.append('api_key', config.apiKey);
  body.append('timestamp', String(timestamp));
  body.append('signature', signature);
  body.append('folder', targetFolder);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${config.cloudName}/auto/upload`, {
    method: 'POST',
    body
  });

  const payload = await response.json();

  if (!response.ok || payload.error) {
    throw new Error(payload?.error?.message || 'Échec du téléversement sur Cloudinary.');
  }

  return {
    assetId: payload.asset_id || '',
    publicId: payload.public_id || '',
    url: payload.secure_url || payload.url || '',
    secureUrl: payload.secure_url || '',
    resourceType: payload.resource_type || '',
    format: payload.format || '',
    bytes: payload.bytes ?? 0,
    width: payload.width ?? null,
    height: payload.height ?? null,
    folder: payload.folder || targetFolder,
    originalFilename: payload.original_filename || file.name || '',
    version: payload.version ?? null
  };
};

export async function POST(request) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files');
    const folder = formData.get('folder');

    const validFiles = files.filter((candidate) => candidate && typeof candidate === 'object' && typeof candidate.arrayBuffer === 'function');

    if (!validFiles.length) {
      return NextResponse.json(
        {
          success: false,
          message: 'Aucun fichier valide n\'a été fourni.'
        },
        { status: 400 }
      );
    }

    const uploads = [];

    for (const file of validFiles) {
      // Upload sequentially to preserve ordering
      const uploadResult = await uploadToCloudinary(file, { folder });
      uploads.push(uploadResult);
    }

    return NextResponse.json({
      success: true,
      files: uploads
    });
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Une erreur est survenue lors du téléversement sur Cloudinary.'
      },
      { status: 500 }
    );
  }
}
