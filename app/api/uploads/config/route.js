import { NextResponse } from "next/server";
import { getCloudinaryConfig } from "../../../../lib/cloudinary";

export const runtime = "nodejs";

export async function GET() {
  const config = getCloudinaryConfig();
  const configured = Boolean(config?.isConfigured);

  const response = {
    success: true,
    configured,
    message: configured
      ? "Cloudinary est configuré."
      : "Cloudinary n'est pas configuré. Merci de définir CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY et CLOUDINARY_API_SECRET.",
  };

  if (configured) {
    response.details = {
      baseFolder: config?.baseFolder || "",
    };
  }

  return NextResponse.json(response);
}
