import { DynamoDBClient, ScanCommand, PutItemCommand, DeleteItemCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall, marshall } from "@aws-sdk/util-dynamodb";

const client = new DynamoDBClient({
  region: "eu-north-1",
});

export const getTodos = async () => {
  try {
    const params = {
      TableName: "Todos",
    };
    const result = await client.send(new ScanCommand(params));
    const transformedItems = result.Items.map((item) => unmarshall(item));
    return {
      statusCode: 200,
      body: JSON.stringify(transformedItems),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: "Failed to fetch todos",
    };
  }
};

export const createTodo = async (event) => {
  try {
    const todo = JSON.parse(event.body);
    const params = {
      TableName: "Todos",
      Item: marshall(todo),
    };
    await client.send(new PutItemCommand(params));
    return {
      statusCode: 201,
      body: JSON.stringify(todo),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: "Failed to create Todo",
    };
  }
};

export const deleteTodo = async (event) => {
  try {
    const todoId = event.pathParameters.todoId;
    if (!todoId) {
      return {
        statusCode: 400,
        body: "todoId is required",
      };
    }
    const params = {
      TableName: "Todos",
      Key: {
        todoId: { S: todoId },
      },
    };
    await client.send(new DeleteItemCommand(params));
    return {
      statusCode: 200,
      body: "Todo deleted successfully",
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: "Failed to delete Todo",
    };
  }
};
