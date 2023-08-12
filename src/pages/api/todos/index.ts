import axios from "axios";
import { v4 as uuid } from "uuid";
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next/types";

const baseUrl = "https://zygoej3i38.execute-api.eu-north-1.amazonaws.com/dev/todos";

const getTodos: NextApiHandler = async (_, res) => {
  try {
    const response = await axios.get(baseUrl);
    res.status(200).json(response.data);
  } catch (error: any) {
    console.error("Error fetching users:", error);
    const status = error.response ? error.response.status : 500;
    res.status(status).json({ error: "Failed to fetch users." });
  }
};

const createTodo: NextApiHandler = async (req, res) => {
  try {
    const { content } = req.body;

    const response = await axios.post(baseUrl, {
      todoId: uuid(),
      content,
      completed: false,
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
