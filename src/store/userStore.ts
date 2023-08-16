import { create } from "zustand";
import axios, { isAxiosError } from "axios";
import { LoginCredentials, User } from "@/types";

export enum LoginState {
  LoginIdle = "login idle",
  LoggingIn = "logging in",
  LoginDone = "login done",
  SignUpIdle = "sign up idle",
  SigningUp = "signing up",
  SignUpDone = "sign up done",
}
interface UserState {
  error: string;
  loginState: LoginState;
  signingUp: boolean;
  user: User | null;
}

export const useUserStore = create<UserState>(() => ({
  error: "",
  loginState: LoginState.LoginIdle,
  signingUp: false,
  user: null,
}));

export const setUser = (user: User | null) => useUserStore.setState({ user });

export const logout = async () => {
  await axios.post("/api/auth/logout");
  setUser(null);
};

export const login = async ({ username, password }: LoginCredentials) => {
  try {
    useUserStore.setState({ loginState: LoginState.LoggingIn, error: "" });
    await axios.post("/api/auth/login", { username, password });
    await fetchUser();
    useUserStore.setState({ loginState: LoginState.LoginDone });
  } catch (error) {
    if (isAxiosError(error)) {
      useUserStore.setState({ error: error.response?.data.error });
    }
    useUserStore.setState({ loginState: LoginState.LoginIdle });
  }
};

export const signUp = async ({ username, password }: LoginCredentials) => {
  try {
    useUserStore.setState({ loginState: LoginState.SigningUp, error: "" });
    await axios.post("/api/auth/signup", { username, password });
    useUserStore.setState({ loginState: LoginState.SignUpDone });
    setTimeout(() => setSigningUp(false), 1000);
  } catch (error) {
    if (isAxiosError(error)) {
      useUserStore.setState({ error: error.response?.data.error });
    }
    useUserStore.setState({ loginState: LoginState.SignUpIdle });
  }
};

export const setSigningUp = (signingUp: boolean) =>
  useUserStore.setState({ signingUp, loginState: signingUp ? LoginState.SignUpIdle : LoginState.LoginIdle });

export const fetchUser = async () => {
  try {
    const response = await axios.get("/api/user", {
      withCredentials: true,
    });
    setUser(response.data.user);
  } catch (err) {
    console.log(err);
  }
};

export const updateUser = async (user: User) => {
  try {
    const response = await axios.patch("/api/user", user, {
      withCredentials: true,
    });
    setUser(response.data.user);
  } catch (err) {
    console.log(err);
  }
};

export const getUserId = () => {
  const attr = useUserStore.getState().user?.UserAttributes.find((attr) => attr.Name === "sub");
  if (!attr) return;
  return attr.Value;
};

export const getAvatarUrl = () => {
  const attr = useUserStore.getState().user?.UserAttributes.find((attr) => attr.Name === "custom:avatarUrl");
  if (!attr) return;
  return attr.Value;
};

export const getName = () => {
  const attr = useUserStore.getState().user?.UserAttributes.find((attr) => attr.Name === "name");
  if (!attr) return;
  return attr.Value;
};
