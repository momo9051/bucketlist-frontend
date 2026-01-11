import { useEffect } from "react";
import { useAuth } from "react-oidc-context";
import type { ReactNode } from "react";

type ProtectedRouteProps = {
  children: ReactNode;
  role?: string;
};

export const ProtectedRoute = ({ children, role }: ProtectedRouteProps) => {
  const auth = useAuth();

  useEffect(() => {
    if (!auth.isLoading && !auth.isAuthenticated && !auth.error) {
      auth.signinRedirect();
    }
  }, [auth]);

  if (auth.isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center py-12 text-lg">
        Laden...
      </div>
    );
  }

  if (auth.error) {
    return (
      <div className="flex flex-1 items-center justify-center py-12 text-red-600">
        Fout bij authenticatie: {auth.error.message}
      </div>
    );
  }

  if (!auth.isAuthenticated) {
    return (
      <div className="flex flex-1 items-center justify-center py-12 text-lg">
        Doorverwijzen naar login...
      </div>
    );
  }

  if (role) {
    const userRole = auth.user?.profile?.role;
    if (userRole && userRole !== role) {
      return (
        <div className="flex flex-1 items-center justify-center py-12 text-lg">
          Geen toegang voor deze rol.
        </div>
      );
    }
  }

  return <>{children}</>;
};
