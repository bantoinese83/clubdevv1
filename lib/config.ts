export const config = {
  siteName: process.env.NEXT_PUBLIC_SITE_NAME || "ClubDev",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://clubdev.com",
  maxUploadSize: Number.parseInt(process.env.NEXT_PUBLIC_MAX_UPLOAD_SIZE || "5242880", 10), // 5MB default
}

