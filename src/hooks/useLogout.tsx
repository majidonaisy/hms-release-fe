import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '@/redux/slices/authSlice';
import { logoutService } from '@/services/Auth';

export const useElectronLogout = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Check if we're in Electron environment using the exposed ipcRenderer
    if (window.ipcRenderer) {
      const handleAppClosing = async () => {
        try {
          console.log('App closing - performing logout...');
          
          // Call logout service (API call)
          await logoutService();
          
          // Clear Redux state
          dispatch(logout());
          
          // Clear localStorage
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          
          console.log('Logout completed successfully');
          
          // Notify main process that logout is complete
          window.ipcRenderer.send('logout-complete');
        } catch (error) {
          console.error('Logout failed during app close:', error);
          // Even if logout fails, still quit the app
          window.ipcRenderer.send('logout-complete');
        }
      };

      // Listen for app closing event
      window.ipcRenderer.on('app-closing', handleAppClosing);

      // Cleanup listener on unmount
      return () => {
        window.ipcRenderer.off('app-closing', handleAppClosing);
      };
    }
  }, [dispatch]);
};