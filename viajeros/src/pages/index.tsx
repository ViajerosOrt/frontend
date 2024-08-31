import { Loader } from "@mantine/core";
import { Inter } from "next/font/google";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();

  // TODO: Add token authentication
  // If the user has no token, redirect to login.
  useEffect(() => {
    if (true) {
      router.replace({
        pathname: `/login`
      });
    }
  }, []);

  return <Loader />;
}
