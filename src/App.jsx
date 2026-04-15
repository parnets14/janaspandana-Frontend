import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import LandingPage from './pages/LandingPage'
import About from './pages/About'
import TrackComplaint from './pages/TrackComplaint'
import AdminLogin from './pages/AdminLogin'
import OfficerLogin from './pages/OfficerLogin'
import OperatorLogin from './pages/OperatorLogin'
import Dashboard from './pages/user/Dashboard'
import UserAbout from './pages/user/About'
import SubmitComplaint from './pages/user/SubmitComplaint'
import MyComplaints from './pages/user/MyComplaints'
import ComplaintDetail from './pages/user/ComplaintDetail'
import Notifications from './pages/user/Notifications'
import Help from './pages/user/Help'
import Profile from './pages/user/Profile'
import OfficerDashboard from './pages/officer/OfficerDashboard'
import CaseDetail from './pages/officer/CaseDetail'
import Updates from './pages/officer/Updates'
import OperatorDashboard from './pages/operator/OperatorDashboard'
import ComplaintManagement from './pages/operator/ComplaintManagement'
import OperatorComplaintDetail from './pages/operator/ComplaintDetail'
import Messages from './pages/operator/Messages'
import Reports from './pages/operator/Reports'
import AdminDashboard from './pages/admin/AdminDashboard'
import UserManagement from './pages/admin/UserManagement'
import AdminComplaintManagement from './pages/admin/ComplaintManagement'
import DepartmentManagement from './pages/admin/DepartmentManagement'
import AdminComplaintDetail from './pages/admin/ComplaintDetail'
import OfficerManagement from './pages/admin/OfficerManagement'
import './App.css'

// Enhanced Authentication Guard
function ProtectedRoute({ children, requiredRole }) {
  const [isChecking, setIsChecking] = useState(true)
  const [isAuthorized, setIsAuthorized] = useState(false)
  
  useEffect(() => {
    const checkAuth = () => {
      const userRole = localStorage.getItem('userRole')
      const userProfile = localStorage.getItem('_userProfile')
      
      let authorized = false
      
      switch (requiredRole) {
        case 'admin':
          authorized = userRole === 'admin'
          if (!authorized) {
            // Force redirect to admin login
            window.location.replace('/admin-login')
            return
          }
          break
          
        case 'officer':
          authorized = userRole === 'officer'
          if (!authorized) {
            window.location.replace('/officer-login')
            return
          }
          break
          
        case 'operator':
          authorized = userRole === 'operator'
          if (!authorized) {
            window.location.replace('/operator-login')
            return
          }
          break
          
        case 'user':
          authorized = !!userProfile
          if (!authorized) {
            window.location.replace('/')
            return
          }
          break
          
        default:
          authorized = true
      }
      
      setIsAuthorized(authorized)
      setIsChecking(false)
    }
    
    // Check immediately
    checkAuth()
    
    // Also check when localStorage changes (for logout scenarios)
    const handleStorageChange = () => {
      checkAuth()
    }
    
    window.addEventListener('storage', handleStorageChange)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [requiredRole])
  
  // Show loading while checking authentication
  if (isChecking) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f8fafc'
      }}>
        <div style={{
          padding: '20px',
          borderRadius: '8px',
          backgroundColor: 'white',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <div style={{ marginBottom: '10px' }}>🔐</div>
          <div>Verifying access...</div>
        </div>
      </div>
    )
  }
  
  // Only render children if authorized
  return isAuthorized ? children : null
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/track-complaint" element={<TrackComplaint />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/officer-login" element={<OfficerLogin />} />
        <Route path="/operator-login" element={<OperatorLogin />} />
        
        {/* User Routes - Protected */}
        <Route path="/user/dashboard" element={
          <ProtectedRoute requiredRole="user">
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/user/about" element={
          <ProtectedRoute requiredRole="user">
            <UserAbout />
          </ProtectedRoute>
        } />
        <Route path="/user/submit" element={
          <ProtectedRoute requiredRole="user">
            <SubmitComplaint />
          </ProtectedRoute>
        } />
        <Route path="/user/complaints" element={
          <ProtectedRoute requiredRole="user">
            <MyComplaints />
          </ProtectedRoute>
        } />
        <Route path="/user/complaint/:id" element={
          <ProtectedRoute requiredRole="user">
            <ComplaintDetail />
          </ProtectedRoute>
        } />
        <Route path="/user/notifications" element={
          <ProtectedRoute requiredRole="user">
            <Notifications />
          </ProtectedRoute>
        } />
        <Route path="/user/help" element={
          <ProtectedRoute requiredRole="user">
            <Help />
          </ProtectedRoute>
        } />
        <Route path="/user/profile" element={
          <ProtectedRoute requiredRole="user">
            <Profile />
          </ProtectedRoute>
        } />
        
        {/* Officer Routes - Protected */}
        <Route path="/officer/dashboard" element={
          <ProtectedRoute requiredRole="officer">
            <OfficerDashboard />
          </ProtectedRoute>
        } />
        <Route path="/officer/updates" element={
          <ProtectedRoute requiredRole="officer">
            <Updates />
          </ProtectedRoute>
        } />
        <Route path="/officer/case/:id" element={
          <ProtectedRoute requiredRole="officer">
            <CaseDetail />
          </ProtectedRoute>
        } />
        
        {/* Operator Routes - Protected */}
        <Route path="/operator/dashboard" element={
          <ProtectedRoute requiredRole="operator">
            <OperatorDashboard />
          </ProtectedRoute>
        } />
        <Route path="/operator/complaints" element={
          <ProtectedRoute requiredRole="operator">
            <ComplaintManagement />
          </ProtectedRoute>
        } />
        <Route path="/operator/complaint/:id" element={
          <ProtectedRoute requiredRole="operator">
            <OperatorComplaintDetail />
          </ProtectedRoute>
        } />
        <Route path="/operator/messages" element={
          <ProtectedRoute requiredRole="operator">
            <Messages />
          </ProtectedRoute>
        } />
        <Route path="/operator/reports" element={
          <ProtectedRoute requiredRole="operator">
            <Reports />
          </ProtectedRoute>
        } />
        
        {/* Admin Routes - Strictly Protected */}
        <Route path="/admin" element={
          <ProtectedRoute requiredRole="admin">
            <Navigate to="/admin/dashboard" replace />
          </ProtectedRoute>
        } />
        <Route path="/admin/dashboard" element={
          <ProtectedRoute requiredRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin/users" element={
          <ProtectedRoute requiredRole="admin">
            <UserManagement />
          </ProtectedRoute>
        } />
        <Route path="/admin/complaints" element={
          <ProtectedRoute requiredRole="admin">
            <AdminComplaintManagement />
          </ProtectedRoute>
        } />
        <Route path="/admin/complaint/:id" element={
          <ProtectedRoute requiredRole="admin">
            <AdminComplaintDetail />
          </ProtectedRoute>
        } />
        <Route path="/admin/departments" element={
          <ProtectedRoute requiredRole="admin">
            <DepartmentManagement />
          </ProtectedRoute>
        } />
        <Route path="/admin/officers" element={
          <ProtectedRoute requiredRole="admin">
            <OfficerManagement />
          </ProtectedRoute>
        } />
        
        {/* Catch-all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
