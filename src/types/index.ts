export interface LoginCredentials {
  username: string;
  password: string;
}

export interface User {
  $metadata: {
    httpStatusCode: number;
    requestId: string;
    attempts: number;
    totalRetryDelay: number;
  };
  UserAttributes: {
    Name: string;
    Value: string;
  }[];
  Username: string;
}

export interface Todo {
  todoId: string;
  content: string;
  completed: boolean;
  userId?: string;
}
