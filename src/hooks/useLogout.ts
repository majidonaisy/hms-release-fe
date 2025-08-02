import { useEffect, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/redux/slices/authSlice";
import { logoutService } from "@/services/Auth";
import { RootState } from "@/redux/store";

export const useElectronLogout = () => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const logoutInProgressRef = useRef(false);

  const handleAppClosing = useCallback(async () => {
    // Prevent multiple logout attempts
    if (logoutInProgressRef.current) {
      console.log("Logout already in progress, skipping...");
      return;
    }

    logoutInProgressRef.current = true;
    console.log("🔥 Received app-closing event, isAuthenticated:", isAuthenticated);

    try {
      // Check for authentication
      const hasToken = localStorage.getItem("accessToken");
      console.log("📋 hasToken:", !!hasToken);

      if (isAuthenticated || hasToken) {
        console.log("🚀 Performing logout...");

        try {
          // Create timeout promise
          const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("Logout timeout")), 5000));

          // Race between logout service and timeout
          await Promise.race([logoutService(), timeoutPromise]);
          console.log("✅ Logout API call completed successfully");
        } catch (logoutError) {
          console.error("❌ Logout API call failed:", logoutError);
          // Continue anyway - we still want to clear local state
        }
      } else {
        console.log("ℹ️ No authentication found, skipping API logout");
      }

      // Always clear local state regardless of API call result
      console.log("🧹 Clearing local state...");
      dispatch(logout());
    } catch (error) {
      console.error("💥 Error during logout process:", error);
      // Still clear local state even if something fails
      dispatch(logout());
    } finally {
      // Always notify main process to complete shutdown
      console.log("📤 Sending logout-complete signal");
      try {
        window.ipcRenderer?.send("logout-complete");
      } catch (ipcError) {
        console.error("Failed to send logout-complete:", ipcError);
      }
      logoutInProgressRef.current = false;
    }
  }, [dispatch, isAuthenticated]);

  useEffect(() => {
    // Check if we're in Electron environment
    if (!window.ipcRenderer) {
      console.log("⚠️ Not in Electron environment, skipping logout setup");
      return;
    }

    console.log("🔧 Setting up Electron logout handler");

    // Register the event listener
    window.ipcRenderer.on("app-closing", handleAppClosing);

    // Cleanup function
    return () => {
      console.log("🔧 Cleaning up Electron logout handler");
      window.ipcRenderer?.off("app-closing", handleAppClosing);
      logoutInProgressRef.current = false;
    };
  }, [handleAppClosing]);

  // Reset logout in progress flag when authentication state changes
  useEffect(() => {
    logoutInProgressRef.current = false;
  }, [isAuthenticated]);
};
