import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import FindTaxiPage from './pages/FindTaxiPage';
import LoadBalancePage from './pages/LoadBalancePage';
import TransactionHistoryPage from './pages/TransactionHistoryPage';
import UserProfilePage from './pages/UserProfilePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import ExpenseAnalysisPage from './pages/ExpenseAnalysisPage';
const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          
          {/* Protected Routes */}
          <Route path="/" element={<PrivateRoute><HomePage /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
          <Route path="/find-taxi" element={<PrivateRoute><FindTaxiPage /></PrivateRoute>} />
          <Route path="/load-balance" element={<PrivateRoute><LoadBalancePage /></PrivateRoute>} />
          <Route 
            path="/transaction-history" 
            element={<PrivateRoute><TransactionHistoryPage /></PrivateRoute>} 
          />
          <Route 
            path="/user-profile" 
            element={<PrivateRoute><UserProfilePage /></PrivateRoute>} 
          />
          <Route path="/expense-analysis" element={<PrivateRoute><ExpenseAnalysisPage /></PrivateRoute>} />
          <Route path="/about" element={<PrivateRoute><AboutPage /></PrivateRoute>} />
          <Route path="/contact" element={<PrivateRoute><ContactPage /></PrivateRoute>} />
          
          {/* Fallback Route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;