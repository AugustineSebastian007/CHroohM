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
import './App.css';

function App() {
  // For demo purposes, we'll use a simple isAuthenticated state
  // In a real app, this would come from your auth context/store
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

  return (
    <Router>
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/sign-out" element={<SignOutPage />} />
        <Route path="/" element={isAuthenticated ? <Layout /> : <Navigate to="/auth" replace />}>
          <Route index element={<TodayPage />} />
          <Route path="upcoming" element={<UpcomingPage />} />
          <Route path="calendar" element={<CalendarPage />} />
          <Route path="sticky-wall" element={<StickyWallPage />} />
          <Route path="list/:listId" element={<ListPage />} />
          <Route path="tag/:tagId" element={<TagPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
        <Route path="*" element={<Navigate to="/auth" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
