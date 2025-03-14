import { createStore, useStore } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { createZustandContext } from "./zustand-context";
import React from "react";

type State = {
  generating: boolean;
  setGenerating: (generating: boolean) => void;
};

const getStore = (initialState: { generating: boolean }) => {
  return createStore<State>()(
    persist(
      (set) => ({
        generating: initialState.generating,
        setGenerating: (generating) => set({ generating }),
      }),
      {
        name: "images-store",
        storage: createJSONStorage(() => localStorage),
      }
    )
  );
};

export const ImageStore = createZustandContext(getStore);

export function useImageStore<T>(selector: (state: State) => T) {
  const store = React.useContext(ImageStore.Context);
  if (!store) {
    throw new Error("useImageStore must be used within a ImageStore.Provider");
  }
  return useStore(store, selector);
}
