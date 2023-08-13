import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { NextApiRequest, NextApiResponse, PageConfig } from "next";
import { v4 as uuid } from "uuid";
import upload from "../../../utils/upload";
import { fromEnv } from "@aws-sdk/credential-provider-env";

const BUCKET_NAME = "prisma-images";
const REGION = "eu-north-1";

const s3Client = new S3Client({ region: REGION, credentials: fromEnv() });

export const config: PageConfig = {
  api: {
    bodyParser: false,
  },
};

interface NextApiRequestWithFile extends NextApiRequest {
  file: {
    buffer: Buffer;
  };
}

export default async function handler(req: NextApiRequestWithFile, res: NextApiResponse) {
  switch (req.method) {
    case "POST":
      try {
        await new Promise((resolve, reject) => {
          const middleware = upload.single("image");
          middleware(req as any, res as any, (err: any) => {
            if (err) {
              reject(err);
              return;
            }
            resolve(null);
          });
        });

        if (!req.file) {
          return res.status(400).json({ error: "No file uploaded" });
        }

        const filename = `${uuid()}.png`;
        const uploadParams = {
          Bucket: BUCKET_NAME,
          Key: filename,
          Body: req.file.buffer,
          ContentType: "image/png",
        };

        await s3Client.send(new PutObjectCommand(uploadParams));

        return res.send({
          imageUrl: `https://${BUCKET_NAME}.s3.${REGION}.amazonaws.com/${filename}`,
        });
      } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ error: "Failed to upload image" });
      }

    default:
      res.setHeader("Allow", ["POST"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
