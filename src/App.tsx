import { BrowserRouter as Router } from 'react-router-dom';
import { RoleProvider } from './context/CASLContext';
import HomeRoutes from './routes/Home/homeRoutes';
import { PostHogProvider } from 'posthog-js/react'
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { Toaster } from './components/molecules/Sonner';
import { DialogProvider } from './context/DialogContext';
import DialogContainer from './components/Templates/DialogContainer';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { setTokens } from '@/redux/slices/authSlice';
import { useElectronLogout } from './hooks/useLogout';

// Token restoration component
const TokenRestoration: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  // Use the logout hook
  useElectronLogout();

  useEffect(() => {
    // Only restore tokens if not already authenticated
    if (!isAuthenticated) {
      const accessToken = localStorage.getItem('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');

      if (accessToken) {
        dispatch(setTokens({
          accessToken,
          refreshToken: refreshToken || undefined
        }));
      }
    }
  }, [dispatch, isAuthenticated]);

  return <>{children}</>;
};

function App() {
  return (
    <PostHogProvider
      apiKey={import.meta.env.VITE_PUBLIC_POSTHOG_KEY}
      options={{
        api_host: "https://us.i.posthog.com"
      }}
    >
      <Provider store={store}>
        <TokenRestoration>
          <RoleProvider>
            <DialogProvider>
              <Router>
                <HomeRoutes />
                <Toaster />
                <DialogContainer />
              </Router>
            </DialogProvider>
          </RoleProvider>
        </TokenRestoration>
      </Provider>
    </PostHogProvider>
  );
}

export default App;