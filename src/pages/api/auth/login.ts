import { InitiateAuthCommand, InitiateAuthCommandInput } from "@aws-sdk/client-cognito-identity-provider";
import client from "../../../services/cognito";
import crypto from "crypto";
import Cookies from "js-cookie";

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

  console.log("LOGGING IN");

  const params: InitiateAuthCommandInput = {
    AuthFlow: "USER_PASSWORD_AUTH",
    ClientId: "5o7brqfj045hijqtko2vhnvfmi",
    AuthParameters: {
      SECRET_HASH: computeSecretHash(username, clientId, clientSecret),
      USERNAME: username,
      PASSWORD: password,
    },
  };
  console.log(params);

  try {
    const response = await client.send(new InitiateAuthCommand(params));
    res.send(response);
  } catch (error: any) {
    console.error("Error in /api/login handler:", error);
    res.status(500).json({ error: error.message || "An error occurred while logging in." });
  }
}
