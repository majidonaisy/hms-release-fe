import { BrowserRouter as Router } from 'react-router-dom';
import { RoleProvider } from './context/CASLContext';
import HomeRoutes from './routes/Home/homeRoutes';
import { PostHogProvider } from 'posthog-js/react'

function App() {
  return (
    <PostHogProvider
      apiKey={import.meta.env.VITE_PUBLIC_POSTHOG_KEY}
      options={{
        api_host: "https://us.i.posthog.com"  
      }}
    >
    <RoleProvider>
      <Router>
        <HomeRoutes />
      </Router>
    </RoleProvider>
    </PostHogProvider>
  );
}

export default App;