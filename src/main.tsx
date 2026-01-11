import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AuthProvider } from "react-oidc-context";
import { WebStorageStateStore, type UserManagerSettings } from "oidc-client-ts";
import App from "./App.tsx";
import "./index.css";

const authority = import.meta.env.VITE_AUTHORITY;
const clientId = import.meta.env.VITE_CLIENT_ID;
const apiUrl = import.meta.env.VITE_API_URL;

if (!authority || !clientId || !apiUrl) {
  // Fail fast during setup to avoid silent misconfigurations
  console.error("Missing required environment variables for OIDC setup.");
}

const oidcConfig: UserManagerSettings = {
  authority,
  client_id: clientId,
  redirect_uri: `${window.location.origin}/signin-callback`,
  post_logout_redirect_uri: `${window.location.origin}/`,
  response_type: "code",
  scope: "openid profile bucketlist.api",
  // Avoid extra userinfo call that can fail on strict CORS setups
  loadUserInfo: false,
  automaticSilentRenew: true,
  monitorSession: true,
  userStore: new WebStorageStateStore({ store: window.localStorage }),
};

const onSigninCallback = (): void => {
  window.history.replaceState({}, document.title, window.location.pathname);
};

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider {...oidcConfig} onSigninCallback={onSigninCallback}>
      <App />
    </AuthProvider>
  </StrictMode>
);
