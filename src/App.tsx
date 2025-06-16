import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { RoleProvider } from './context/CASLContext';
import Navigation from './components/Organisms/Navigation';
import HotelReservationCalendar from './pages/HotelScheduler';

function App() {
  return (
    <RoleProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navigation />
          <main>
            <HotelReservationCalendar />
          </main>
        </div>
      </Router>
    </RoleProvider>
  );
}

export default App;