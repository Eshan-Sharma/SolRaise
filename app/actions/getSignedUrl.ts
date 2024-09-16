"use server";

import { S3Client, S3ClientConfig, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";


const s3ClientConfig: S3ClientConfig = {
    region: process.env.AWS_BUCKET_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
};

const s3Client = new S3Client(s3ClientConfig);

export async function getSignedURL(fileName: string) {

    const putObjectCommand = new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME!,
        Key: fileName,
    });

    const signedUrl = await getSignedUrl(s3Client, putObjectCommand, {
        expiresIn: 60,
    });
    return { success: { url: signedUrl } };
}