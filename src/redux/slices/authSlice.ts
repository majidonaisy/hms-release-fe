import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// interface User {
//   id?: string;
//   firstName?: string;
//   lastName?: string;
//   email?: string;
// }

interface AuthState {
  accessToken: string | null;
  // refreshToken: string | null;
  isAuthenticated: boolean;
  // user: User | null;
}

const initialState: AuthState = {
  accessToken: null,
  // refreshToken: null,
  isAuthenticated: false,
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
        // refreshToken?: string;
        // user?: User;
      }>
    ) => {
      console.log("🔄 Redux login action called with:", action.payload);
      state.accessToken = action.payload.accessToken;
      // state.refreshToken = action.payload.refreshToken || null;
      // state.user = action.payload.user || null;
      state.isAuthenticated = true;
      console.log("✅ Redux state updated:", {
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
      });
    },
    logout: (state) => {
      state.accessToken = null;
      // state.refreshToken = null;
      // state.user = null;
      state.isAuthenticated = false;
    },
    updateAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
    },
  },
});

export const { login, logout, updateAccessToken } = authSlice.actions;
export default authSlice.reducer;
