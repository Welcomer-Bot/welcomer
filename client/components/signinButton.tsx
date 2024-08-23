"use client";

import { signIn } from "next-auth/react";
import { Button } from "@nextui-org/button";
import { useState } from "react";

export function SignIn() {
  const [isRedirecting, setIsRedirecting] = useState<boolean>(false);

  return (
    <Button
      color="primary"
      isLoading={isRedirecting}
      type="submit"
      onClick={() => {
        setIsRedirecting(true);
        signIn("discord", { redirectTo: "/dashboard" });
      }}
    >
      Login with Discord
    </Button>
  );
}
