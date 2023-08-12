import { NextApiRequest, NextApiResponse } from "next";
import { GetUserCommand } from "@aws-sdk/client-cognito-identity-provider";
import client from "../../services/cognito";
import cookie from "cookie";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const cookies = cookie.parse(req.headers.cookie || "");
    const accessToken = cookies.accessToken;

    const getUserCommand = new GetUserCommand({
      AccessToken: accessToken,
    });

    const userDetails = await client.send(getUserCommand);

    return res.status(200).json({ user: userDetails });
  } catch (error) {
    res.status(500).json(error);
  }
}
