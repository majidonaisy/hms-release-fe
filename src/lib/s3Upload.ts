// import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

// interface UploadOptions {
//     prefix?: string;
//   }

// const s3Client = new S3Client({
//     region: import.meta.env.VITE_AWS_REGION,
//     credentials: {
//         accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
//         secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
//     },
// });

// export async function uploadToS3(file: File, options: UploadOptions = {}): Promise<string> {
//     try {
//         const fileArrayBuffer = await file.arrayBuffer();
//         const fileData = new Uint8Array(fileArrayBuffer);

//         const fileExtension = file.name.split('.').pop();
//         const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExtension}`;

//         const key = options.prefix
//             ? `${options.prefix}/${fileName}`
//             : fileName;

//         const command = new PutObjectCommand({
//             Bucket: import.meta.env.VITE_AWS_BUCKET_NAME,
//             Key: key,
//             Body: fileData,
//             ContentType: file.type,
//         });

//         await s3Client.send(command);

//         return `https://${import.meta.env.VITE_AWS_BUCKET_NAME}.s3.${import.meta.env.VITE_AWS_REGION}.amazonaws.com/${key}`;
//     } catch (error) {
//         console.error('Error uploading to S3:', error);
//         throw error;
//     }
// }