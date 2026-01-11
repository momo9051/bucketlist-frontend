import axios, { type AxiosInstance } from "axios";
import { useEffect, useMemo } from "react";
import { useAuth } from "react-oidc-context";

export const useApi = (): AxiosInstance => {
  const auth = useAuth();

  const api = useMemo(() => {
    return axios.create({
      baseURL: import.meta.env.VITE_API_URL,
    });
  }, []);

  useEffect(() => {
    const interceptorId = api.interceptors.request.use((config) => {
      const token = auth.user?.access_token;
      if (token) {
        config.headers = config.headers ?? {};
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    return () => {
      api.interceptors.request.eject(interceptorId);
    };
  }, [api, auth.user?.access_token]);

  return api;
};
