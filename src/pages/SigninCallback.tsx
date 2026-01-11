import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "react-oidc-context";

export const SigninCallback = () => {
  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth.isLoading && auth.isAuthenticated) {
      navigate("/bucketlist");
    }
    if (auth.error) {
      navigate("/");
    }
  }, [auth.isLoading, auth.isAuthenticated, auth.error, navigate]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
      <h1 className="text-xl font-semibold text-gray-700">Account verifiëren...</h1>
      <p className="text-gray-500">Je wordt over enkele ogenblikken doorgestuurd.</p>
    </div>
  );
};
