import crypto from 'crypto';

const cloudName = process.env.CLOUDINARY_CLOUD_NAME ?? '';
const apiKey = process.env.CLOUDINARY_API_KEY ?? '';
const apiSecret = process.env.CLOUDINARY_API_SECRET ?? '';
const baseFolder = process.env.CLOUDINARY_BASE_FOLDER ?? 'portage-salarial';

const isConfigured = Boolean(cloudName && apiKey && apiSecret);

if (!isConfigured) {
  console.warn(
    'Cloudinary environment variables are missing. File uploads will fail until CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET are provided.'
  );
}

const cloudinaryConfig = Object.freeze({
  cloudName,
  apiKey,
  apiSecret,
  baseFolder,
  isConfigured
});

const normalizeValue = (value) => {
  if (Array.isArray(value)) {
    return value.join(',');
  }

  return value;
};

export const createSignature = (params = {}) => {
  if (!cloudinaryConfig.isConfigured) {
    throw new Error('Cloudinary configuration is incomplete.');
  }

  const filteredEntries = Object.entries(params).filter(([, value]) => {
    return value !== undefined && value !== null && value !== '';
  });

  const sortedEntries = filteredEntries.sort(([keyA], [keyB]) => {
    if (keyA < keyB) return -1;
    if (keyA > keyB) return 1;
    return 0;
  });

  const signaturePayload = sortedEntries
    .map(([key, value]) => `${key}=${normalizeValue(value)}`)
    .join('&');

  return crypto.createHash('sha1').update(`${signaturePayload}${cloudinaryConfig.apiSecret}`).digest('hex');
};

export const getCloudinaryConfig = () => cloudinaryConfig;

export default cloudinaryConfig;
