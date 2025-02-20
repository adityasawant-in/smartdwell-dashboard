// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import Dashboard from './pages/Dashboard';
import Readwater from './pages/Readwater';
import Complaints from './pages/Complaints';
import Patrolling from './pages/Patrolling';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRole="admin">
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/Readwater"
            element={
              <ProtectedRoute allowedRole="user">
                <Readwater/>
              </ProtectedRoute>
            }
          />
          <Route
            path="/Complaints"
            element={
              <ProtectedRoute allowedRole="user">
                <Complaints/>
              </ProtectedRoute>
            }
          />
          <Route
            path="/Patrolling"
            element={
              <ProtectedRoute allowedRole="user">
                <Patrolling/>
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<LoginForm />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;