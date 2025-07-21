import { BrowserRouter as Router } from 'react-router-dom';
import { RoleProvider } from './context/CASLContext';
import HomeRoutes from './routes/Home/homeRoutes';
import { PostHogProvider } from 'posthog-js/react'
import { Provider } from 'react-redux';
import { store, persistor } from './redux/store';
import { PersistGate } from 'redux-persist/integration/react';
import { Toaster } from './components/molecules/Sonner';
import { DialogProvider } from './context/DialogContext';
import DialogContainer from './components/Templates/DialogContainer';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { setTokens } from '@/redux/slices/authSlice';

// Token restoration component
const TokenRestoration: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

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
        <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
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
        </PersistGate>
      </Provider>
    </PostHogProvider>
  );
}

export default App;