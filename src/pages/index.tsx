import { useState, useEffect, Fragment } from "react";
import LoginForm from "@/components/LoginForm";
import Todos from "@/components/Todos";
import axios from "axios";
import { GetServerSideProps } from "next";
import { setUser, useUserStore, logout, fetchUser } from "@/store/userStore";
import Drawer from "@/components/Drawer";
import * as Dialog from "@radix-ui/react-dialog";
import * as Popover from "@radix-ui/react-popover";
import useWindowSize from "@/hooks/useWindowSize";
import Avatar from "@/components/Avatar";
import "../app/globals.css";
import Profile from "@/components/Profile";

export default function Home({ userData }: { userData: any }) {
  const [optionsOpen, setOptionsOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);
  const user = useUserStore((state) => state.user);

  useEffect(() => {
    setUser(userData);
  }, []);

  const isMobile = useWindowSize().width < 640;

  return (
    <Fragment>
      <main className="bg-zinc-950 min-h-screen h-screen flex flex-col">
        <nav className="p-4">
          {user && (
            <Popover.Root>
              <Popover.Trigger>
                <Avatar onClick={() => setOptionsOpen((prev) => !prev)} displayLetter="T" />
              </Popover.Trigger>
              {!isMobile && (
                <Popover.Portal>
                  <Popover.Content sideOffset={12}>
                    <div className="border border-gray-700 bg-black shadow rounded-lg ml-2 overflow-clip flex flex-col">
                      <button
                        onClick={() => setEditingProfile(true)}
                        className="text-sm px-5 py-2.5 text-white hover:bg-gray-800 text-left"
                      >
                        Muokkaa profiilia
                      </button>
                      <button onClick={logout} className="text-sm px-5 py-2.5 text-white hover:bg-gray-800 text-left">
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
      <Dialog.Root open={editingProfile}>
        <Dialog.Portal>
          <Dialog.Overlay onClick={() => setEditingProfile(false)} className="fixed inset-0 bg-black/40 grid place-items-center" />
          <Dialog.Content className="absolute left-1/2 top-1/2 translate-x-[-50%] translate-y-[-50%] p-4 flex flex-col">
            <Profile />
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </Fragment>
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
