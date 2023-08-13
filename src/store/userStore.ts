import { create } from "zustand";
import Cookies from "js-cookie";
import axios from "axios";
import { LoginCredentials, User } from "@/types";

interface UserState {
  user: User | null;
}

export const useUserStore = create<UserState>(() => ({
  user: null,
}));

export const setUser = (user: User | null) => useUserStore.setState({ user });

export const logout = () => {
  Cookies.remove("accessToken");
  setUser(null);
};

export const login = async ({ username, password }: LoginCredentials) => {
  try {
    await axios.post("/api/auth/login", { username, password });
    fetchUser();
  } catch (error) {
    console.error("Error logging up:", error);
  }
};

export const fetchUser = async () => {
  try {
    const response = await axios.get("http://localhost:3000/api/user", {
      withCredentials: true,
    });
    setUser(response.data.user);
  } catch (err) {
    console.log(err);
  }
};

export const updateUser = async (user: User) => {
  try {
    const response = await axios.patch("http://localhost:3000/api/user", user, {
      withCredentials: true,
    });
    setUser(response.data.user);
  } catch (err) {
    console.log(err);
  }
};

export const getAvatarUrl = () => {
  const attr = useUserStore.getState().user?.UserAttributes.find((attr) => attr.Name === "custom:avatarUrl");
  if (!attr) return;
  return attr.Value;
};
