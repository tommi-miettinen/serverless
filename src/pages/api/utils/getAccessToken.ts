import { NextApiRequest } from "next";
import cookie from "cookie";

export const getAccessToken = (req: NextApiRequest) => {
  const cookies = cookie.parse(req.headers.cookie || "");
  const accessToken = cookies.accessToken;
  return accessToken;
};
