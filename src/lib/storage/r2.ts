import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const accountId = process.env.R2_ACCOUNT_ID;
const accessKeyId = process.env.CF_R2_ACCESS_KEY_ID || process.env.R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.CF_R2_SECRET_ACCESS_KEY || process.env.R2_SECRET_ACCESS_KEY;
const bucketName = process.env.R2_BUCKET_NAME || 'medcore';
// Utilizando a URL publica para leitura, e a Endpoint API para escrita
const publicUrl = process.env.NEXT_PUBLIC_R2_PUBLIC_URL;

if (!accountId || !accessKeyId || !secretAccessKey) {
  throw new Error("Missing R2 credentials in environment variables.");
}

export const s3Client = new S3Client({
  region: 'auto',
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

export async function getPresignedUploadUrl(filename: string, contentType: string) {
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: filename,
    ContentType: contentType,
  });

  // A URL expira em 5 minutos
  const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 300 });
  
  return {
    uploadUrl: signedUrl,
    publicUrl: `${publicUrl}/${filename}`
  };
}
