import axios from "axios";
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next/types";
import { handleError } from "../utils/apiErrorHandler";
import { getAccessToken } from "../utils/getAccessToken";

const baseUrl = "https://50c3dyk64c.execute-api.eu-north-1.amazonaws.com/dev/todos";

const getTodos: NextApiHandler = async (req, res) => {
  try {
    const accessToken = getAccessToken(req);

    const response = await axios.get(baseUrl, {
      headers: {
        Authorization: accessToken,
      },
    });
    res.status(200).json(response.data);
  } catch (error) {
    handleError(error, res);
  }
};

const createTodo: NextApiHandler = async (req, res) => {
  try {
    const accessToken = getAccessToken(req);

    const response = await axios.post(baseUrl, req.body, {
      headers: {
        Authorization: accessToken,
      },
    });

    res.status(200).json(response.data);
  } catch (error: any) {
    handleError(error, res);
  }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "GET":
      return getTodos(req, res);

    case "POST":
      return createTodo(req, res);

    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
