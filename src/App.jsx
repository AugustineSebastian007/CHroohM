import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import TodayPage from './pages/TodayPage';
import UpcomingPage from './pages/UpcomingPage';
import CalendarPage from './pages/CalendarPage';
import StickyWallPage from './pages/StickyWallPage';
import ListPage from './pages/ListPage';
import TagPage from './pages/TagPage';
import AuthPage from './pages/AuthPage';
import SignOutPage from './pages/SignOutPage';
import SettingsPage from './pages/SettingsPage';
import './App.css';
import { useEffect, useState } from 'react';

function App() {
  // Use state to track authentication status
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Check localStorage on component mount
  useEffect(() => {
    const authStatus = localStorage.getItem('isAuthenticated') === 'true';
    setIsAuthenticated(authStatus);
  }, []);
  
  // Add event listener for storage changes (for multi-tab support)
  useEffect(() => {
    const handleStorageChange = () => {
      const authStatus = localStorage.getItem('isAuthenticated') === 'true';
      setIsAuthenticated(authStatus);
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/auth" element={isAuthenticated ? <Navigate to="/" replace /> : <AuthPage />} />
        <Route path="/sign-out" element={<SignOutPage />} />
        <Route path="/" element={isAuthenticated ? <Layout /> : <Navigate to="/auth" replace />}>
          <Route index element={<TodayPage />} />
          <Route path="upcoming" element={<UpcomingPage />} />
          <Route path="calendar" element={<CalendarPage />} />
          <Route path="sticky-wall" element={<StickyWallPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="list/:listId" element={<ListPage />} />
          <Route path="tag/:tagId" element={<TagPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
        <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/auth"} replace />} />
      </Routes>
    </Router>
  );
}

export default App;
