import axios from "axios";
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next/types";
import cookie from "cookie";

const baseUrl = "https://50c3dyk64c.execute-api.eu-north-1.amazonaws.com/dev/todos";

const getTodos: NextApiHandler = async (req, res) => {
  try {
    const cookies = cookie.parse(req.headers.cookie || "");
    const accessToken = cookies.accessToken;

    const response = await axios.get(baseUrl, {
      headers: {
        Authorization: accessToken,
      },
    });
    res.status(200).json(response.data);
  } catch (error: any) {
    console.error("Error fetching todo:", error);
    const status = error.response ? error.response.status : 500;
    res.status(status).json({ error: "Failed to fetch todos." });
  }
};

const createTodo: NextApiHandler = async (req, res) => {
  try {
    const cookies = cookie.parse(req.headers.cookie || "");
    const accessToken = cookies.accessToken;
    const response = await axios.post(baseUrl, req.body, {
      headers: {
        Authorization: accessToken,
      },
    });

    res.status(200).json(response.data);
  } catch (error: any) {
    const status = error.response ? error.response.status : 500;
    res.status(status).json({ error: "Failed to create user." });
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
