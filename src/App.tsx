import { BrowserRouter as Router } from 'react-router-dom';
import { RoleProvider } from './context/CASLContext';
import MainLayout from './layout/MainLayout';

function App() {
  return (
    <RoleProvider>
      <Router>
        <MainLayout />
      </Router>
    </RoleProvider>
  );
}

export default App;