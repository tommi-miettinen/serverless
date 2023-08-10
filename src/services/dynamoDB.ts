import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import bcrypt from "bcryptjs";
import { v4 as uuid } from "uuid";

const client = new DynamoDBClient({
  region: "eu-north-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
});

const createUser = async (username: string, plaintextPassword: string) => {
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(plaintextPassword, salt);

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
    return results;
  } catch (err) {
    console.error(err);
  }
};

export default {
  createUser,
};
