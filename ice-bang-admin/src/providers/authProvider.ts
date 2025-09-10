import type { AuthProvider } from "@refinedev/core";
const API_URL = import.meta.env.VITE_API_URL;

export const authProvider: AuthProvider = {
  login: async ({ email, password }) => {
    const response = await fetch(`${API_URL}/v0/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // 세션 유지
      body: JSON.stringify({ email, password }),
    });

    const result = await response.json();

    if (!result.success) {
      return {
        success: false,
        error: {
          name: "LoginError",
          message: result.message || "Login failed",
        },
      };
    }

    // 세션 기반이므로 localStorage 저장 필요 없음
    return {
      success: true,
      redirectTo: "/",
    };
  },

  logout: async () => {
    await fetch(`${API_URL}/v0/auth/logout`, {
      method: "POST",
      credentials: "include",
    });

    return {
      success: true,
      redirectTo: "/login",
    };
  },

  check: async () => {
    const response = await fetch(`${API_URL}/v0/auth/check-session`, {
      credentials: "include",
    });
    const result = await response.json();

  if (result.success && result.data === true) {
    return { authenticated: true };
  }
  return { authenticated: false, redirectTo: "/login" };
  },

  getPermissions: async () => {
    const response = await fetch(`${API_URL}/v0/auth/permissions`, {
      credentials: "include",
    });
    const result = await response.json();
    return result.data || null;
  },

  getIdentity: async () => {
    const response = await fetch(`${API_URL}/v0/users/me`, {
      credentials: "include",
    });
    const result = await response.json();
    return result.data || null;
  },

  onError: async (error) => {
    console.error("Auth Error:", error);
    return { error };
  },
};
