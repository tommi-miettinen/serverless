import { SignUpCommand } from "@aws-sdk/client-cognito-identity-provider";
import client from "../../../services/cognito";
import crypto from "crypto";

function computeSecretHash(username: string, clientID: string, clientSecret: string) {
  return crypto
    .createHmac("SHA256", clientSecret)
    .update(username + clientID)
    .digest("base64");
}

const clientId = process.env.AWS_COGNITO_ID as string;
const clientSecret = process.env.AWS_COGNITO_SECRET as string;

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ success: false, error: "Username and password are required." });
  }

  const params = {
    ClientId: clientId,
    Username: username,
    SecretHash: computeSecretHash(username, clientId, clientSecret),
    Password: password,
    UserAttributes: [
      {
        Name: "name",
        Value: username,
      },
      {
        Name: "email",
        Value: `${username}@email.com`,
      },
    ],
  };

  try {
    const result = await client.send(new SignUpCommand(params));
    res.send(result);
  } catch (error: any) {
    console.error("Error signing up with Cognito:", error);
    res.status(500).json({ success: false, error: error.message });
  }
}
