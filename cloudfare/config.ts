import { ListBucketsCommand, S3Client } from "@aws-sdk/client-s3";

// If using environment variables
const accountId = process.env.NEXT_PUBLIC_R2_CLOUDFLARE_ACCOUNT_ID;
const accessKeyId = process.env.NEXT_PUBLIC_R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.NEXT_PUBLIC_R2_SECRET_ACCESS_KEY;
const bucketName = process.env.NEXT_PUBLIC_R2_BUCKET_NAME;

if (!accountId || !accessKeyId || !secretAccessKey || !bucketName) {
  throw new Error("Missing required R2 configuration environment variables");
}

// Create S3 client configured for Cloudflare R2
export const storage = new S3Client({
  region: "auto",
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

export { bucketName, accountId };
