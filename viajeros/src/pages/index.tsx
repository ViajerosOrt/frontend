import { Center, Loader } from "@mantine/core";
import { Inter } from "next/font/google";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace({
      pathname: `/login`,
    });
  }, []);

  return (
    <Center style={{ height: "100vh" }}>
      <Loader />
    </Center>
  );
}
