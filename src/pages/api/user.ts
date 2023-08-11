import { NextApiRequest, NextApiResponse } from "next";
import { GetUserCommand } from "@aws-sdk/client-cognito-identity-provider";
import client from "../../services/cognito";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const accessToken = req.headers.authorization?.replace("Bearer ", "");

    console.log(req.headers.authorization);

    if (!accessToken) {
      return res.status(400).json({ error: "Access token not provided." });
    }

    const getUserCommand = new GetUserCommand({
      AccessToken: accessToken,
    });

    const userDetails = await client.send(getUserCommand);

    return res.status(200).json({ user: userDetails });
  } catch (error) {
    console.error("Error fetching user from Cognito:", error);
    res.status(500).json({ error: "An error occurred while fetching user data." });
  }
}
