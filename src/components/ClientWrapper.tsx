"use client";

import { ReactNode } from "react";
import { useUser } from "@/context/UserContext";
import { useCart } from "@/context/CartContext";

export default function ClientWrapper({ children }: { children: ReactNode }) {
  const { loading: userLoading } = useUser();
  const { initialized: cartInitialized } = useCart();

  if (userLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg font-bold">Loading ...</p>
      </div>
    );
  }

  if (!cartInitialized) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg font-bold">Loading cart...</p>
      </div>
    );
  }

  return <>{children}</>;
}
