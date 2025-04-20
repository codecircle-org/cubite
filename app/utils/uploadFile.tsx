import AWS from 'aws-sdk';

const s3Client = new AWS.S3({
  endpoint: process.env.NEXT_PUBLIC_OBJECT_STORAGE_ENDPOINT,
  accessKeyId: process.env.NEXT_PUBLIC_OBJECT_STORAGE_ACCESS_KEY,
  secretAccessKey: process.env.NEXT_PUBLIC_OBJECT_STORAGE_SECRET_KEY,
});

export async function uploadFile(file: File, fileName: string, contentType: string): Promise<string> {
  const params = {
    Bucket: process.env.NEXT_PUBLIC_OBJECT_STORAGE_BUCKET_NAME,
    Key: fileName,
    Body: file,
    ACL: 'public-read',
    ContentType: contentType,
  };

  try {
    const { Location } = await s3Client.upload(params).promise();
    return Location;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
}
