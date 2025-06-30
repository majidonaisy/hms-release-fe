import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "./slices/authSlice";

// Persist configuration for auth slice
const authPersistConfig = {
  key: "auth",
  storage,
  whitelist: ["accessToken", "isAuthenticated"],
};

const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/FLUSH", "persist/REHYDRATE", "persist/PAUSE", "persist/PERSIST", "persist/PURGE", "persist/REGISTER"],
      },
    }),
});

export const persistor = persistStore(store);

// Enable listener behavior for the store
setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
