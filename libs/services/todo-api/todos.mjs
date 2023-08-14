import { DynamoDBClient, ScanCommand, PutItemCommand, DeleteItemCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall, marshall } from "@aws-sdk/util-dynamodb";
import jwt from "jsonwebtoken";
import jwksClient from "jwks-rsa";

const COGNITO_POOL_URL = "https://cognito-idp.eu-north-1.amazonaws.com/eu-north-1_x7Uj50IG9";

const jwks = jwksClient({
  jwksUri: `${COGNITO_POOL_URL}/.well-known/jwks.json`,
});

const client = new DynamoDBClient({
  region: "eu-north-1",
});

export const auth = async (event) => {
  const token = event.authorizationToken;
  const decoded = jwt.decode(token, { complete: true });

  const key = await jwks.getSigningKey(decoded.header.kid);
  const signingKey = key.getPublicKey();

  const verifiedToken = jwt.verify(token, signingKey);
  const userId = verifiedToken.sub;

  return generatePolicy(userId, "Allow", event.methodArn, token);
};

const generatePolicy = (principalId, effect, resource) => {
  const policy = {
    principalId,
    policyDocument: {
      Version: "2012-10-17",
      Statement: [
        {
          Action: "execute-api:Invoke",
          Effect: effect,
          Resource: resource,
        },
      ],
    },
  };

  return policy;
};

export const getTodos = async (event) => {
  try {
    const userId = event.requestContext.authorizer.principalId;
    const params = {
      TableName: "Todos",
      FilterExpression: "userId = :userId",
      ExpressionAttributeValues: {
        ":userId": { S: userId },
      },
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
      body: JSON.stringify(event),
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

export const updateTodo = async (event) => {
  try {
    const todoId = event.pathParameters.todoId;
    const todo = JSON.parse(event.body);

    if (!todoId) {
      return {
        statusCode: 400,
        body: "todoId is required",
      };
    }

    const params = {
      TableName: "Todos",
      Item: marshall(todo),
    };

    await client.send(new PutItemCommand(params));

    return {
      statusCode: 200,
      body: "Updated Todo",
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ todoId: event.pathParameters, todo: event.body }),
    };
  }
};
