import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import { useEffect } from 'react';
import LoadingSpinner from './common/LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, loading, user, token } = useAuth();
  const router = useRouter();

  console.log('ProtectedRoute - Auth State:', { 
    isAuthenticated, 
    loading, 
    hasUser: !!user, 
    hasToken: !!token 
  });

  useEffect(() => {
    console.log('ProtectedRoute - useEffect triggered', { 
      isAuthenticated, 
      loading 
    });
    
    if (!loading && !isAuthenticated) {
      console.log('ProtectedRoute - Redirecting to login page');
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    console.log('ProtectedRoute - Still loading, showing spinner');
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  console.log('ProtectedRoute - Rendering children:', { isAuthenticated });
  return isAuthenticated ? <>{children}</> : null;
};

export default ProtectedRoute; 