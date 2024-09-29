import { Center, Loader } from "@mantine/core";
import { useRouter } from "next/router";
import { PropsWithChildren, useEffect, useState } from "react";

const AuthenticatedRoutes = ({ children }: PropsWithChildren) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    // Because of a race condition with zustand, we access the local storage directly to know wheter a user 
    // authenticated
    const storage = localStorage.getItem('viajeros-user');

    try {
      const store = storage ? JSON.parse(storage) : null;
      // If no user authenticated, redirect to login
      if (!store?.state?.currentUser) {
        router.push('/login');
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error('Failed to parse local storage:', error);
      router.push('/login');
    }
  }, [router]);

  if (loading) {
    return (<Center style={{ height: "100vh" }}>
      <Loader />
    </Center>
    )
  }

  return <>{children}</>;
}


export default AuthenticatedRoutes;