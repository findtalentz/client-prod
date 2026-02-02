"use client";
import {
  QueryClient,
  QueryClientProvider as ReactQueryClinetProvider,
} from "@tanstack/react-query";
import { PropsWithChildren } from "react";

export const queryClient = new QueryClient();

export default function QueryClientProvider({ children }: PropsWithChildren) {
  return (
    <ReactQueryClinetProvider client={queryClient}>
      {children}
    </ReactQueryClinetProvider>
  );
}
