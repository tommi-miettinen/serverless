import { DynamoDBClient, ListTablesCommand, PutItemCommand } from "@aws-sdk/client-dynamodb";
import LoginForm from "@/components/LoginForm";
import bcrypt from "bcryptjs";
import { v4 as uuid } from "uuid";

const client = new DynamoDBClient({
  region: "eu-north-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
});

async function createUser(username: string, plaintextPassword: string) {
  // Generate a salt and hash the password
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(plaintextPassword, salt);

  // Put the user data in DynamoDB
  const command = new PutItemCommand({
    TableName: "Users",
    Item: {
      userId: { S: uuid() },
      username: { S: username },
      password: { S: hashedPassword },
    },
  });

  try {
    const results = await client.send(command);
    console.log(results);
  } catch (err) {
    console.error(err);
  }
}

export default function Home() {
  async function listTables() {
    try {
      const data = await client.send(new ListTablesCommand({}));
      console.log("Success", data.TableNames);
    } catch (err) {
      console.error(err);
    }
  }

  // Call the function to list tables (for testing purposes, but don't leave this in production code!)
  listTables();

  return (
    <main className="bg-black flex min-h-screen flex-col items-center justify-center">
      <LoginForm />
    </main>
  );
}
