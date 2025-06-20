import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { RoleProvider } from './context/CASLContext';
import MainLayout from './layout/MainLayout';

function App() {
  return (
    <RoleProvider>
      <Router>
        <MainLayout>
          <div className='min-h-screen bg-green-100'>

          </div>
        </MainLayout>
      </Router>
    </RoleProvider>
  );
}

export default App;