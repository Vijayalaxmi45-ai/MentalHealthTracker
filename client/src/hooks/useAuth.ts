import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";

const api = axios.create({
  baseURL: "/api",
});

// Add interceptor to include JWT in requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("mindtune_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export function useAuth() {
  const queryClient = useQueryClient();
  const [token, setToken] = useState(localStorage.getItem("mindtune_token"));

  const { data: user, isLoading, error } = useQuery({
    queryKey: ["/api/auth/me", token],
    queryFn: async () => {
      if (!token) return null;
      try {
        const res = await api.get("/auth/me");
        return res.data;
      } catch (err) {
        localStorage.removeItem("mindtune_token");
        setToken(null);
        return null;
      }
    },
    enabled: !!token,
  });

  const loginMutation = useMutation({
    mutationFn: async (credentials: any) => {
      const res = await api.post("/auth/login", credentials);
      return res.data;
    },
    onSuccess: (data) => {
      localStorage.setItem("mindtune_token", data.token);
      setToken(data.token);
      queryClient.setQueryData(["/api/auth/me", data.token], data.user);
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (userData: any) => {
      const res = await api.post("/auth/register", userData);
      return res.data;
    },
    onSuccess: (data) => {
      localStorage.setItem("mindtune_token", data.token);
      setToken(data.token);
      queryClient.setQueryData(["/api/auth/me", data.token], data.user);
    },
  });

  const logout = () => {
    localStorage.removeItem("mindtune_token");
    setToken(null);
    queryClient.setQueryData(["/api/auth/me", null], null);
    window.location.href = "/";
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login: loginMutation.mutateAsync,
    register: registerMutation.mutateAsync,
    logout,
  };
}
