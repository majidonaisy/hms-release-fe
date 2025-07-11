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
          <RoleProvider>
            <DialogProvider>
            <Router>
              <HomeRoutes />
              <Toaster/>
              <DialogContainer />
            </Router>
            </DialogProvider>
          </RoleProvider>
        </PersistGate>
      </Provider>
    </PostHogProvider>
  );
}

export default App;