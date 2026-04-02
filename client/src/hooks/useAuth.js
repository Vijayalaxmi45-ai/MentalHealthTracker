"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAuth = useAuth;
const react_query_1 = require("@tanstack/react-query");
function useAuth() {
    const { data: user, isLoading } = (0, react_query_1.useQuery)({
        queryKey: ["/api/auth/user"],
        retry: false,
    });
    return {
        user,
        isLoading,
        isAuthenticated: !!user,
    };
}
