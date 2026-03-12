"use client";
import { createContext, ReactNode, useContext } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Dictionary = Record<string, any>;

const DictionaryContext = createContext<Dictionary>({});

export function DictionaryProvider({
  dictionary,
  children,
}: {
  dictionary: Dictionary;
  children: ReactNode;
}) {
  return (
    <DictionaryContext.Provider value={dictionary}>
      {children}
    </DictionaryContext.Provider>
  );
}

export default function useDictionary() {
  return useContext(DictionaryContext);
}
