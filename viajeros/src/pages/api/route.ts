import { useAuth } from '@/hooks/useAth'
import { NextApiRequest, NextApiResponse } from 'next'
import { useRouter } from 'next/router';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { currentUser } = useAuth()
  const router = useRouter();

  // Check if the user is authenticated
  if (!currentUser) {
    res.status(401).json({
      error: 'User is not authenticated',
    })
    router.push("/");
    return
  }

  // Proceed with the route for authorized users
  // ... implementation of the API Route
}