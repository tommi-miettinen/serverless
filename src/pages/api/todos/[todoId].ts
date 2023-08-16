import axios from "axios";
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next/types";
import { getAccessToken } from "../utils/getAccessToken";

const baseUrl = "https://50c3dyk64c.execute-api.eu-north-1.amazonaws.com/dev/todos";

const deleteTodo: NextApiHandler = async (req, res) => {
  try {
    const { todoId } = req.query;
    const accessToken = getAccessToken(req);

    const headers = {
      headers: {
        Authorization: accessToken,
      },
    };

    const response = await axios.delete(`${baseUrl}/${todoId}`, headers);
    res.status(200).json(response.data);
  } catch (error: any) {
    console.error("Error creating user:", error);
    const status = error.response ? error.response.status : 500;
    res.status(status).json({ error: "Failed to delete Todo." });
  }
};

const updateTodo: NextApiHandler = async (req, res) => {
  try {
    const { todoId } = req.query;
    const accessToken = getAccessToken(req);

    const headers = {
      headers: {
        Authorization: accessToken,
      },
    };

    const response = await axios.patch(`${baseUrl}/${todoId}`, req.body, headers);
    res.status(200).json(response.data);
  } catch (error: any) {
    console.log(error);
    const status = error.response ? error.response.status : 500;
    res.status(status).json({ error: "Failed to delete Todo." });
  }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "DELETE":
      return deleteTodo(req, res);
    case "PATCH":
      return updateTodo(req, res);

    default:
      res.setHeader("Allow", ["DELETE", "PATCH"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
