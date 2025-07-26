import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Register from './pages/Auth/Register';
import Login from './pages/Auth/Login';
import WorkSessions from './pages/WorkSessions';
import Insights from './pages/Insights';
import BottomNav from './components/BottomNav';
import ProtectedRoute from './components/ProtectedRoute';
import GuestRoute from './components/GuestRoute';
import { AuthProvider } from './contexts/AuthContext';

const AppRoutes = () => {
  const location = useLocation();
  const hideBottomNav = ['/login', '/register'].includes(location.pathname);

  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />

        <Route
          path="/register"
          element={
            <GuestRoute>
              <Register />
            </GuestRoute>
          }
        />
        <Route
          path="/login"
          element={
            <GuestRoute>
              <Login />
            </GuestRoute>
          }
        />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/sessions"
          element={
            <ProtectedRoute>
              <WorkSessions />
            </ProtectedRoute>
          }
        />
        <Route
          path="/insights"
          element={
            <ProtectedRoute>
              <Insights />
            </ProtectedRoute>
          }
        />
      </Routes>

      {!hideBottomNav && <BottomNav />}
    </>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <div className="bg-gray-950 text-white min-h-screen">
        <Router>
          <AppRoutes />
        </Router>
      </div>
    </AuthProvider>
  );
};

export default App;
