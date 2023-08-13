import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";

const client = new S3Client({ region: "eu-north-1" });
const BUCKET_NAME = "images";

export const handler = async (event) => {
  const base64String = event.body.image;
  const buffer = Buffer.from(base64String, "base64");
  const fileName = uuidv4();

  const s3Params = {
    Bucket: BUCKET_NAME,
    Key: `avatars/${fileName}.png`,
    Body: buffer,
    ContentType: "image/png",
    ACL: "public-read",
  };

  try {
    await client.send(new PutObjectCommand(s3Params));
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Successfully uploaded image!",
        imageUrl: `https://${BUCKET_NAME}.s3.amazonaws.com/avatars/${fileName}.png`,
      }),
    };
  } catch (error) {
    console.error("Error uploading to S3: ", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to upload image" }),
    };
  }
};
