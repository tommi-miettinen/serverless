import { create } from "zustand";

interface User {
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

interface UserState {
  user: User | null;
}

export const useUserStore = create<UserState>(() => ({
  user: null,
}));

export const setUser = (user: User) => useUserStore.setState({ user });

export const logout = () => useUserStore.setState({ user: null });
