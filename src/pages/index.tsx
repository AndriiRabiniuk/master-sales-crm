import { useEffect } from 'react';
import { useRouter } from 'next/router';
import LoadingSpinner from '@/components/common/LoadingSpinner';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to login page
    router.push('/login');
  }, [router]);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <LoadingSpinner size="large" />
    </div>
  );
}
