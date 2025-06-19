"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button"; // ShadCN Button

export default function AuthButton() {
  const { data: session } = useSession();

  if (session) {
    return (
      <div className="space-y-2">
        <p className="text-sm">Welcome, {session.user.name}</p>
        <Button variant="outline" onClick={() => signOut()}>
          Sign Out
        </Button>
      </div>
    );
  }

  return (
    <Button onClick={() => signIn("google")}>
      Sign In with Google
    </Button>
  );
}
