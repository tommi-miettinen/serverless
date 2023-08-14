import { useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";

interface OverlayProps {
  open: boolean;
  dismiss: () => void;
  children: JSX.Element;
}

const Overlay = ({ open, dismiss, children }: OverlayProps) => {
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
    <Dialog.Root open={open}>
      <Dialog.Portal>
        <Dialog.Overlay onClick={() => dismiss} className="fixed inset-0 w-screen h-screen bg-black/40 grid place-items-center" />
        <Dialog.Content className="fixed inset-0">{children}</Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default Overlay;
