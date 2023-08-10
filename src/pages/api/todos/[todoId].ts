import axios from "axios";

const deleteTodo = async (req: any, res: any) => {
  try {
    const { todoId } = req.query;
    console.log(todoId);
    const response = await axios.delete(`https://h0ug3s28wc.execute-api.eu-north-1.amazonaws.com/test/todos/${todoId}`);
    res.status(200).json(response.data);
  } catch (error: any) {
    console.error("Error creating user:", error);
    const status = error.response ? error.response.status : 500;
    res.status(status).json({ error: "Failed to delete Todo." });
  }
};

export default async function handler(req: any, res: any) {
  switch (req.method) {
    case "DELETE":
      return deleteTodo(req, res);

    default:
      res.setHeader("Allow", ["DELETE"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
