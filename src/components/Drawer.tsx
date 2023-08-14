"use client";
import { useEffect } from "react";
import { Drawer } from "vaul";

interface DrawerProps {
  open: boolean;
  dismiss: () => void;
  children: JSX.Element;
}

export default ({ open, dismiss, children }: DrawerProps) => {
  useEffect(() => {
    if (open) {
      history.pushState({ overlay: true }, "");

      const handlePopState = (event: PopStateEvent) => {
        if (event.state?.overlay) {
          dismiss();
        }
      };
      window.addEventListener("popstate", handlePopState);
      return () => {
        window.removeEventListener("popstate", handlePopState);
      };
    }
  }, [open, dismiss]);

  return (
    <Drawer.Root open={open} shouldScaleBackground>
      <Drawer.Portal>
        <Drawer.Overlay onClick={dismiss} className="fixed inset-0 bg-black/40" />
        <Drawer.Content className="shadow-none flex flex-col rounded-t-[10px] h- mt-24 fixed bottom-0 left-0 right-0">
          {children}
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};
