import { useQuery } from "@tanstack/react-query";

export function useAuth() {
  return {
    user: { id: 1, firstName: "Guest", lastName: "User" },
    isLoading: false,
    isAuthenticated: true,
  };
}
