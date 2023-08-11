import { useEffect } from "react";
import LoginForm from "@/components/LoginForm";
import Todos from "@/components/Todos";
import axios from "axios";
import "../app/globals.css";
import { GetServerSideProps } from "next";
import { setUser, useUserStore, logout } from "../store/userStore";
import Cookies from "js-cookie";

const Avatar = () => {
  return (
    <div onClick={logout} className="h-[36px] w-[36px] rounded-full bg-indigo-300 flex items-center justify-center">
      T
    </div>
  );
};

export default function Home({ userData }: { userData: any }) {
  const user = useUserStore((state) => state.user);

  useEffect(() => {
    console.log(userData);
    setUser(userData);
  }, []);

  return (
    <main className="bg-black min-h-screen h-screen flex flex-col">
      <nav className="p-4">
        <Avatar />
      </nav>
      <div className="flex flex-col w-full h-full items-center justify-center">{user ? <Todos /> : <LoginForm />}</div>
    </main>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const accessToken = context.req.headers.cookie?.split("=").pop();

    const response = await axios.get("http://localhost:3000/api/user", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      withCredentials: true,
    });
    const userData = response.data;

    return {
      props: {
        userData,
      },
    };
  } catch (error) {
    return {
      props: {
        userData: null,
      },
    };
  }
};
