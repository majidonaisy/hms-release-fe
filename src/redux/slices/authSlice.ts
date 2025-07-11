import { Permissions } from "@/validation";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  permissions: Permissions[];
  // user: User | null;
}

const initialState: AuthState = {
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  permissions: [],
  // user: null,
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
        // user?: User;
      }>
    ) => {
      state.accessToken = action.payload.accessToken;
      state.permissions = action.payload.permissions || [];
      state.refreshToken = action.payload.refreshToken || null;
      // state.user = action.payload.user || null;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.accessToken = null;
      state.permissions = [];
      state.refreshToken = null;
      // state.user = null;
      state.isAuthenticated = false;
    },
    updateAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
    },
    setTokens: (state, action: PayloadAction<{ accessToken: string; refreshToken?: string }>) => {
      state.accessToken = action.payload.accessToken;
      if (action.payload.refreshToken) {
        state.refreshToken = action.payload.refreshToken;
      }
    },
  },
});

export const { login, logout, updateAccessToken, setTokens } = authSlice.actions;
export default authSlice.reducer;
