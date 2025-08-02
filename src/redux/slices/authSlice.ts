import { Permissions } from "@/validation";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  permissions: Permissions[];
}

const initialState: AuthState = {
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  permissions: [],
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (
      state,
      action: PayloadAction<{
        accessToken: string;
        permissions?: Permissions[];
        refreshToken?: string;
      }>
    ) => {
      state.accessToken = action.payload.accessToken;
      state.permissions = action.payload.permissions || [];
      state.refreshToken = action.payload.refreshToken || null;
      state.isAuthenticated = true;

      // Persist tokens and permissions
      localStorage.setItem("accessToken", action.payload.accessToken);
      if (action.payload.refreshToken) {
        localStorage.setItem("refreshToken", action.payload.refreshToken);
      }
      if (action.payload.permissions) {
        localStorage.setItem("permissions", JSON.stringify(action.payload.permissions));
      }
    },
    logout: (state) => {
      state.accessToken = null;
      state.permissions = [];
      state.refreshToken = null;
      state.isAuthenticated = false;

      // Clear persisted data completely
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("permissions");

      // Clear any other auth-related data
      sessionStorage.clear();

      console.log("🧹 Authentication state and storage cleared completely");
    },
    updateAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
      localStorage.setItem("accessToken", action.payload);
    },
    setTokens: (state, action: PayloadAction<{ accessToken: string; refreshToken?: string }>) => {
      state.accessToken = action.payload.accessToken;
      state.isAuthenticated = true;
      if (action.payload.refreshToken) {
        state.refreshToken = action.payload.refreshToken;
      }

      // Try to restore permissions from localStorage
      try {
        const storedPermissions = localStorage.getItem("permissions");
        if (storedPermissions) {
          state.permissions = JSON.parse(storedPermissions);
        }
      } catch (error) {
        console.error("Error parsing stored permissions:", error);
        state.permissions = [];
      }
    },
    clearAuthState: (state) => {
      // Reset to initial state
      Object.assign(state, initialState);

      // Clear all storage
      localStorage.clear();
      sessionStorage.clear();

      console.log("🔄 Application state reset to fresh start");
    },
  },
});

export const { login, logout, updateAccessToken, setTokens, clearAuthState } = authSlice.actions;
export default authSlice.reducer;
