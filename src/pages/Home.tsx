import { useAuth } from "react-oidc-context";

export const Home = () => {
  const { isAuthenticated, isLoading, error, user, signinRedirect, signoutRedirect } =
    useAuth();

  const handleLogin = async () => {
    await signinRedirect();
  };

  const handleLogout = async () => {
    await signoutRedirect();
  };

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center py-12 text-lg">
        Laden...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-1 items-center justify-center py-12 text-red-600">
        Fout bij authenticatie: {error.message}
      </div>
    );
  }

  return (
    <div className="flex flex-1 items-center justify-center py-16 px-6">
      <div className="max-w-2xl w-full bg-white shadow-sm rounded-lg p-8 border border-gray-100">
        <h1 className="text-2xl font-semibold mb-4">Bucket List</h1>
        {!isAuthenticated ? (
          <div className="space-y-3">
            <p className="text-gray-700">
              Log in om je bucket list items te beheren.
            </p>
            <button
              className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition"
              onClick={handleLogin}
            >
              Inloggen
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-gray-700">
              Ingelogd als{" "}
              <span className="font-semibold">
                {user?.profile?.name || user?.profile?.sub}
              </span>
            </p>
            <button
              className="px-4 py-2 rounded-md bg-gray-200 text-gray-800 hover:bg-gray-300 transition"
              onClick={handleLogout}
            >
              Uitloggen
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
