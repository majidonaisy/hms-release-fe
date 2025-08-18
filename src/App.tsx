import { HashRouter as Router } from 'react-router-dom';
import { RoleProvider } from './context/CASLContext';
import HomeRoutes from './routes/Home/homeRoutes';
import { PostHogProvider } from 'posthog-js/react'
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { Toaster } from './components/molecules/Sonner';
import { DialogProvider } from './context/DialogContext';
import DialogContainer from './components/Templates/DialogContainer';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { setTokens, clearAuthState } from '@/redux/slices/authSlice';
import { useElectronLogout } from './hooks/useLogout';
import DebugIPC from './components/DebugIPC';

// Token restoration component
const TokenRestoration: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [isRestoring, setIsRestoring] = useState(true);

  // Use the logout hook
  useElectronLogout();

  useEffect(() => {
    const restoreTokens = () => {
      try {
        // Clear any potential corrupted state first
        if (!isAuthenticated) {
          const accessToken = localStorage.getItem('accessToken');
          const refreshToken = localStorage.getItem('refreshToken');

          if (accessToken) {
            console.log('🔄 Restoring tokens from localStorage');
            dispatch(setTokens({
              accessToken,
              refreshToken: refreshToken || undefined,
            }));
          } else {
            // If no tokens, ensure we start fresh
            console.log('🆕 No tokens found, starting fresh');
            dispatch(clearAuthState());
          }
        }
      } catch (error) {
        console.error('Error restoring tokens:', error);
        // Clear potentially corrupted tokens and start fresh
        console.log('🔄 Clearing corrupted data and starting fresh');
        dispatch(clearAuthState());
      } finally {
        setIsRestoring(false);
      }
    };

    // Add a small delay to ensure proper restoration
    const timeoutId = setTimeout(restoreTokens, 100);

    return () => clearTimeout(timeoutId);
  }, [dispatch, isAuthenticated]);

  // Show loading state while restoring tokens
  if (isRestoring) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

function App() {
  return (
    <Provider store={store}>
      <PostHogProvider
        apiKey={import.meta.env.VITE_PUBLIC_POSTHOG_KEY}
        options={{
          api_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST,
        }}
      >
        <Router>
          <TokenRestoration>
            <RoleProvider>
              <DialogProvider>
                <div className="App">
                  <DebugIPC />
                  <HomeRoutes />
                  <DialogContainer />
                  <Toaster position="top-right" />
                </div>
              </DialogProvider>
            </RoleProvider>
          </TokenRestoration>
        </Router>
      </PostHogProvider>
    </Provider>
  );
}

export default App;