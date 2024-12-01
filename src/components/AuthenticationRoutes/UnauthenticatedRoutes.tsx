import { useRouter } from "next/router";
import { PropsWithChildren, useEffect, useState } from "react";
import { ViajeroLoader } from "../ViajeroLoader/ViajeroLoader";

const UnauthenticatedRoutes = ({ children }: PropsWithChildren) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If there's an authenticated routes, redirect to dashboard.
    const storage = localStorage.getItem('viajeros-user');

    try {
      const store = storage ? JSON.parse(storage) : null;
      // If no user authenticated, redirect to login
      if (!!store?.state?.currentUser) {
        router.push('/travels'); // Redirect to the login page if no user is found
      } else {
        setLoading(false)
      }
    } catch (error) {
      console.error('Failed to parse local storage:', error);
      router.push('/login');
    }
  }, [router]);

  if (loading) {
    return <ViajeroLoader />
  }

  return <>{children}</>;
}


export default UnauthenticatedRoutes;