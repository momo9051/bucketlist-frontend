import { useAuth } from "react-oidc-context";
import { useNavigate } from "react-router-dom";
import { getDisplayName } from "../../utils/auth";

export const Header = () => {
  const { isAuthenticated, user, signinRedirect, signoutRedirect } = useAuth();
  const navigate = useNavigate();
  const displayName = getDisplayName(user?.profile);

  return (
    <header className="w-full bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="font-semibold text-xl text-indigo-700">Bucket List</div>
        <div className="flex items-center gap-3 text-sm">
          {isAuthenticated && (
            <button
              className="px-3 py-1.5 rounded-md bg-gray-100 text-gray-800 hover:bg-gray-200 transition"
              onClick={() => navigate("/my-items")}
            >
              Mijn items
            </button>
          )}
          {isAuthenticated && (
            <span className="text-gray-700">
              {displayName}
            </span>
          )}
          <button
            className="px-3 py-1.5 rounded-md border border-indigo-600 text-indigo-700 hover:bg-indigo-50 transition"
            onClick={() => (isAuthenticated ? signoutRedirect() : signinRedirect())}
          >
            {isAuthenticated ? "Uitloggen" : "Inloggen"}
          </button>
        </div>
      </div>
    </header>
  );
};
