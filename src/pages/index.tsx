import { useEffect } from "react";
import { GetServerSideProps } from "next";
import LoginForm from "@/components/LoginForm";
import { setUser, useUserStore } from "@/store/userStore";
import LoggedIn from "@/views/LoggedIn";
import axios from "axios";
import "../app/globals.css";

export default function Home({ userData }: { userData: any }) {
  const user = useUserStore((state) => state.user);

  useEffect(() => {
    setUser(userData);
  }, []);

  console.log(user);

  return (
    <div className="bg-zinc-950 flex flex-col h-screen w-screen justify-center items-center overflow-auto">
      {user ? <LoggedIn /> : <LoginForm />}
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const response = await axios.get("http://localhost:3000/api/user", {
      withCredentials: true,
      headers: {
        Cookie: context.req.headers.cookie,
      },
    });

    const userData = response.data.user;
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
