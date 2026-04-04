import { BrowserRouter, Routes, Route } from 'react-router-dom'
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
import './App.css'

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
        
        {/* User Routes */}
        <Route path="/user/dashboard" element={<Dashboard />} />
        <Route path="/user/about" element={<UserAbout />} />
        <Route path="/user/submit" element={<SubmitComplaint />} />
        <Route path="/user/complaints" element={<MyComplaints />} />
        <Route path="/user/complaint/:id" element={<ComplaintDetail />} />
        <Route path="/user/notifications" element={<Notifications />} />
        <Route path="/user/help" element={<Help />} />
        <Route path="/user/profile" element={<Profile />} />
        
        {/* Officer Routes */}
        <Route path="/officer/dashboard" element={<OfficerDashboard />} />
        <Route path="/officer/updates" element={<Updates />} />
        <Route path="/officer/case/:id" element={<CaseDetail />} />
        
        {/* Operator Routes */}
        <Route path="/operator/dashboard" element={<OperatorDashboard />} />
        <Route path="/operator/complaints" element={<ComplaintManagement />} />
        <Route path="/operator/complaint/:id" element={<OperatorComplaintDetail />} />
        <Route path="/operator/messages" element={<Messages />} />
        <Route path="/operator/reports" element={<Reports />} />
        
        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<UserManagement />} />
        <Route path="/admin/complaints" element={<AdminComplaintManagement />} />
      </Routes>
    </BrowserRouter>
  )
}
