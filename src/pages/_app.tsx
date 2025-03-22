import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "@/context/AuthContext";
import { useRouter } from "next/router";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const publicPaths = ["/login", "/register", "/forgot-password"];
  const isPublicPath = publicPaths.includes(router.pathname);

  return (
    <AuthProvider>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      {isPublicPath ? (
        <Component {...pageProps} />
      ) : (
        <ProtectedRoute>
          <Component {...pageProps} />
        </ProtectedRoute>
      )}
    </AuthProvider>
  );
}
