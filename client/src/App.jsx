import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import NavBar from './components/NavBar/NavBar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import FlowExplorer from './pages/FlowExplorer';
import Simulation from './pages/Simulation';
import Comparison from './pages/Comparison';
import History from './pages/History';
import Documentation from './pages/Documentation';

// Protected route wrapper
const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

function AppRoutes() {
  return (
    <>
      <NavBar />
      <div className="page-wrapper">
        {/* Decorative orbs */}
        <div className="orb orb-blue" />
        <div className="orb orb-purple" />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/docs" element={<Documentation />} />
          <Route path="/flow" element={<PrivateRoute><FlowExplorer /></PrivateRoute>} />
          <Route path="/simulation" element={<PrivateRoute><Simulation /></PrivateRoute>} />
          <Route path="/comparison" element={<PrivateRoute><Comparison /></PrivateRoute>} />
          <Route path="/history" element={<PrivateRoute><History /></PrivateRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

// v2 - enhanced routing