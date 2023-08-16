"use client";
import { useState, Fragment } from "react";
import Todos from "@/components/Todos";
import { useUserStore, logout, getAvatarUrl } from "@/store/userStore";
import * as Dialog from "@radix-ui/react-dialog";
import * as Popover from "@radix-ui/react-popover";
import useWindowSize from "@/hooks/useWindowSize";
import Avatar from "@/components/Avatar";
import "../app/globals.css";
import Profile from "@/components/Profile";
import { useSpring, animated } from "@react-spring/web";
import Overlay from "@/components/Overlay";

const AnimatedDialogOverlay = animated(Dialog.Overlay);

const LoggedIn = () => {
  const [editingProfile, setEditingProfile] = useState(false);
  const [overlayVisible, setOverlayVisible] = useState(false);

  const user = useUserStore((state) => state.user);

  const isMobile = useWindowSize().width < 640;

  const appSpring = useSpring({
    scale: isMobile && editingProfile ? 0.9 : 1,
    opacity: isMobile && editingProfile ? 0 : 1,
    config: {
      tension: 170,
      friction: 26,
    },
  });

  const dialogSpring = useSpring({
    opacity: editingProfile ? 1 : 0,
    scale: editingProfile ? 1 : 0.9,
    config: {
      tension: 150,
      friction: 20,
      duration: 100,
    },
  });

  const backgroundSpring = useSpring({
    opacity: editingProfile ? 0.4 : 0,
    blur: editingProfile ? 10 : 0,
    config: {
      tension: 150,
      friction: 20,
      clamp: true,
    },
  });

  const mobileProfileSpring = useSpring({
    opacity: editingProfile ? 1 : 0,
    scale: editingProfile ? 1 : 1.1,
    config: {
      tension: 150,
      friction: 20,
      clamp: true,
    },
    onRest: () => {
      if (!editingProfile) {
        setOverlayVisible(false);
      }
    },
  });

  const handleMobileProfileOpen = () => {
    setOverlayVisible(true);
    setEditingProfile(true);
  };

  return (
    <Fragment>
      <animated.main style={appSpring} className="bg-zinc-950 w-full h-full flex flex-col">
        <nav className="p-4">
          {user && (
            <Popover.Root>
              <Popover.Trigger>
                <Avatar imageUrl={getAvatarUrl()} onClick={() => isMobile && handleMobileProfileOpen()} displayLetter="T" />
              </Popover.Trigger>
              {!isMobile && (
                <Popover.Portal>
                  <Popover.Content sideOffset={12}>
                    <div className="w-[200px] border border-gray-700 p-2 bg-black shadow rounded-lg ml-2 overflow-clip flex flex-col">
                      <button
                        onClick={() => {
                          setEditingProfile(true);
                          setOverlayVisible(true);
                        }}
                        className="text-sm px-3 py-2 rounded text-white hover:bg-gray-800 text-left"
                      >
                        Profile
                      </button>
                      <button onClick={logout} className="text-sm rounded px-3 py-2 text-white hover:bg-gray-800 text-left">
                        Logout
                      </button>
                    </div>
                  </Popover.Content>
                </Popover.Portal>
              )}
            </Popover.Root>
          )}
        </nav>
        <div className="m-auto w-full h-full flex items-center justify-center">
          <Todos />
        </div>
      </animated.main>
      {!isMobile && overlayVisible && (
        <Fragment>
          <animated.div style={{ backdropFilter: backgroundSpring.blur.to((value) => `blur(${value}px)`) }} className="fixed inset-0" />
          <Dialog.Root open={true}>
            <Dialog.Portal>
              <AnimatedDialogOverlay
                onClick={() => setEditingProfile(false)}
                style={{ opacity: backgroundSpring.opacity }}
                className="fixed inset-0 bg-black grid place-items-center"
              />
              <Dialog.Content className="absolute left-1/2 top-1/2 translate-x-[-50%] translate-y-[-50%] p-4 flex flex-col">
                <animated.div className="border rounded-lg border-zinc-700 overflow-clip" style={dialogSpring}>
                  <Profile onSave={() => setEditingProfile(false)} />
                </animated.div>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </Fragment>
      )}
      {isMobile && overlayVisible && (
        <Overlay open={true} dismiss={() => setEditingProfile(false)}>
          <animated.div style={mobileProfileSpring} className="w-screen h-screen bg-zinc-950 flex flex-col">
            <button
              onClick={() => setEditingProfile(false)}
              type="button"
              className="m-4 ml-auto rounded-lg p-2.5 hover:bg-gray-800 hover:bg-opacity-80 inline-flex items-center justify-center aspect-1"
              aria-label="Close"
            >
              <span className="sr-only">Close</span>
              <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                <path
                  stroke="white"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
              </svg>
            </button>
            <Profile onSave={() => setEditingProfile(false)} />
            <button onClick={logout} className="text-white hover:text-opacity-80 py-2 px-5 mt-auto mb-4 mx-4 rounded-lg">
              Kirjaudu ulos
            </button>
          </animated.div>
        </Overlay>
      )}
    </Fragment>
  );
};

export default LoggedIn;
