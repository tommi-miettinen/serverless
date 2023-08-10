import axios from "axios";
import bcrypt from "bcryptjs";
import { v4 as uuid } from "uuid";

const getUsers = async (req: any, res: any) => {
  try {
    const response = await axios.get("https://h0ug3s28wc.execute-api.eu-north-1.amazonaws.com/test");
    res.status(200).json(response.data);
  } catch (error: any) {
    console.error("Error fetching users:", error);
    const status = error.response ? error.response.status : 500;
    res.status(status).json({ error: "Failed to fetch users." });
  }
};

const createUser = async (req: any, res: any) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: "Required user details are missing." });
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const response = await axios.post("https://h0ug3s28wc.execute-api.eu-north-1.amazonaws.com/test", {
      userId: uuid(),
      username,
      password: hashedPassword,
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
      return getUsers(req, res);

    case "POST":
      return createUser(req, res);

    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
