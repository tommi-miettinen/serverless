"use client";

import { Drawer } from "vaul";

export default ({ open, dismiss }: { open: boolean; dismiss: () => void }) => {
  return (
    <Drawer.Root open={open} shouldScaleBackground>
      <Drawer.Portal>
        <Drawer.Overlay onClick={dismiss} className="fixed inset-0 bg-black/40" />
        <Drawer.Content className="shadow-none flex flex-col rounded-t-[10px] h- mt-24 fixed bottom-0 left-0 right-0">
          <div className="p-4 bg-black border-t border-gray-700  rounded-t-[10px] flex-1">
            <button className="w-full py-2.5 px-5 bg-indigo-300 hover:bg-indigo-400 text-black font-semibold rounded-lg">
              Kirjaudu ulos
            </button>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};
