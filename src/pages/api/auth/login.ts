import { InitiateAuthCommand, InitiateAuthCommandInput } from "@aws-sdk/client-cognito-identity-provider";
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

  const params: InitiateAuthCommandInput = {
    AuthFlow: "USER_PASSWORD_AUTH",
    ClientId: "5o7brqfj045hijqtko2vhnvfmi",
    AuthParameters: {
      SECRET_HASH: computeSecretHash(username, clientId, clientSecret),
      USERNAME: username,
      PASSWORD: password,
    },
  };

  try {
    const response = await client.send(new InitiateAuthCommand(params));

    const id_token = response.AuthenticationResult?.IdToken;
    const access_token = response.AuthenticationResult?.AccessToken;
    const refresh_token = response.AuthenticationResult?.RefreshToken;

    res.setHeader("Set-Cookie", [
      `idToken=${id_token}; path=/; HttpOnly; Secure; SameSite=Lax`,
      `accessToken=${access_token}; path=/; HttpOnly; Secure; SameSite=Lax`,
      `refreshToken=${refresh_token}; path=/; HttpOnly; Secure; SameSite=Lax`,
    ]);
    res.send(response);
  } catch (error: any) {
    console.error("Error in /api/login handler:", error);
    res.status(500).json({ error: error.message || "An error occurred while logging in." });
  }
}
