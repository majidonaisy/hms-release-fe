import { BrowserRouter as Router } from 'react-router-dom';
import { RoleProvider } from './context/CASLContext';
import HomeRoutes from './routes/Home/homeRoutes';

function App() {
  return (
    <RoleProvider>
      <Router>
        <HomeRoutes />
      </Router>
    </RoleProvider>
  );
}

export default App;