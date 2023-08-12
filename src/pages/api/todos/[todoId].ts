import axios from "axios";
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next/types";

const baseUrl = "https://zygoej3i38.execute-api.eu-north-1.amazonaws.com/dev/todos";

const deleteTodo: NextApiHandler = async (req, res) => {
  try {
    const { todoId } = req.query;
    const response = await axios.delete(`${baseUrl}/${todoId}`);
    res.status(200).json(response.data);
  } catch (error: any) {
    console.error("Error creating user:", error);
    const status = error.response ? error.response.status : 500;
    res.status(status).json({ error: "Failed to delete Todo." });
  }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "DELETE":
      return deleteTodo(req, res);

    default:
      res.setHeader("Allow", ["DELETE"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
