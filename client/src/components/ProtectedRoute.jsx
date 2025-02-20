// import { Navigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';

// const ProtectedRoute = ({ children, allowedRole }) => {
//   const { isAuthenticated, userType, loading } = useAuth();

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
//       </div>
//     );
//   }

//   if (!isAuthenticated) {
//     return <Navigate to="/login" />;
//   }

//   if (allowedRole && userType !== allowedRole) {
//     return <Navigate to="/" />;
//   }

//   return children;
// };

// export default ProtectedRoute;

import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRole }) => {
  const { isAuthenticated, userType, loading } = useAuth();
  const location = useLocation();

  // Check if we're coming from dashboard
  const fromDashboard = location.state?.fromDashboard;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Allow access if coming from dashboard (assuming admin)
  if (fromDashboard && userType === 'admin') {
    return children;
  }

  // Regular authentication checks
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Role check
  if (allowedRole && userType !== allowedRole && userType !== 'admin') {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;