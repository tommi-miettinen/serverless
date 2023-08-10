import axios from "axios";
import { v4 as uuid } from "uuid";

const getTodos = async (req: any, res: any) => {
  try {
    const response = await axios.get("https://h0ug3s28wc.execute-api.eu-north-1.amazonaws.com/test/todos");
    res.status(200).json(response.data);
  } catch (error: any) {
    console.error("Error fetching users:", error);
    const status = error.response ? error.response.status : 500;
    res.status(status).json({ error: "Failed to fetch users." });
  }
};

const createTodo = async (req: any, res: any) => {
  try {
    const { content } = req.body;

    const response = await axios.post("https://h0ug3s28wc.execute-api.eu-north-1.amazonaws.com/test/todos", {
      todoId: uuid(),
      content,
      completed: false,
    });

    res.status(200).json(response.data);
  } catch (error: any) {
    console.error("Error creating user:", error);
    const status = error.response ? error.response.status : 500;
    res.status(status).json({ error: "Failed to create user." });
  }
};

export default async function handler(req: any, res: any) {
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
