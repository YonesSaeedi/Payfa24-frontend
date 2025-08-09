import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// import LoginPage from '../pages/LoginPage';
// import Dashboard from '../pages/Dashboard';
// import Profile from '../pages/Profile';
// import PrivateRoute from './PrivateRoute';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* <Route path="/login" element={<LoginPage />} /> */}
        {/* <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} /> */}
        {/* <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} /> */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
