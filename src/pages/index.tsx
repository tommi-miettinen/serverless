import { useState, useEffect } from "react";
import LoginForm from "@/components/LoginForm";
import Todos from "@/components/Todos";
import axios from "axios";
import { GetServerSideProps } from "next";
import { setUser, useUserStore, logout } from "../store/userStore";
import Drawer from "@/components/Drawer";
import * as Popover from "@radix-ui/react-popover";
import useWindowSize from "@/hooks/useWindowSize";
import "../app/globals.css";

const Avatar = ({ onClick, displayLetter }: { onClick: (e: React.MouseEvent<HTMLDivElement>) => void; displayLetter: string }) => {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer hover:bg-indigo-400 h-[36px] w-[36px] rounded-full bg-indigo-300 flex items-center text-black justify-center"
    >
      {displayLetter}
    </div>
  );
};

export default function Home({ userData }: { userData: any }) {
  const [optionsOpen, setOptionsOpen] = useState(false);
  const user = useUserStore((state) => state.user);

  useEffect(() => {
    setUser(userData);
  }, []);

  const isMobile = useWindowSize().width < 640;

  return (
    <main className="bg-black min-h-screen h-screen flex flex-col">
      <nav className="p-4">
        {user && (
          <Popover.Root>
            <Popover.Trigger>
              <Avatar onClick={() => setOptionsOpen((prev) => !prev)} displayLetter="T" />
            </Popover.Trigger>
            {!isMobile && (
              <Popover.Portal>
                <Popover.Content sideOffset={12}>
                  <div className="border border-gray-700 bg-black shadow rounded-lg ml-2 overflow-clip">
                    <button onClick={logout} className="text-sm px-5 py-2.5 text-white hover:bg-gray-800">
                      Kirjaudu ulos
                    </button>
                  </div>
                </Popover.Content>
              </Popover.Portal>
            )}
          </Popover.Root>
        )}
      </nav>
      <div className="flex flex-col w-full h-full items-center justify-center overflow-auto">{user ? <Todos /> : <LoginForm />}</div>
      {isMobile && <Drawer open={optionsOpen} dismiss={() => setOptionsOpen(false)} />}
    </main>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const response = await axios.get("http://localhost:3000/api/user", {
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
