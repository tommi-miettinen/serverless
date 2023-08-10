import { DynamoDBClient, ListTablesCommand } from "@aws-sdk/client-dynamodb";
import LoginForm from "@/components/LoginForm";

const client = new DynamoDBClient({
  region: "eu-north-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
});

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
