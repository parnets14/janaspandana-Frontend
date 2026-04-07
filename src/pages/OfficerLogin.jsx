import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  MdOutlineEngineering, MdEmail, MdLockOutline,
  MdArrowForward, MdOutlineVerifiedUser, MdOutlineShield,
} from 'react-icons/md'
import { RiGovernmentLine } from 'react-icons/ri'
import toast, { Toaster } from 'react-hot-toast'
import Navbar from '../components/Navbar'
import api from '../utils/secureApi'

export default function OfficerLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await api.post('/admin/officer-login', { email, password })
      if (response.success) {
        api.clearTokens()
        localStorage.removeItem('userRole')
        api.setTokens(response.data.accessToken, response.data.refreshToken)
        localStorage.setItem('userRole', 'officer')
        localStorage.setItem('officerDept', response.data.officer?.department?.name || '')
        toast.success('Login successful!', { duration: 1500, position: 'top-center' })
        setTimeout(() => navigate('/officer/dashboard'), 500)
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Login failed'
      toast.error(msg, { position: 'top-center' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh', width: '100%', backgroundColor: '#FFF7EC',
      display: 'flex', flexDirection: 'column',
      fontFamily: "system-ui, 'Segoe UI', Roboto, sans-serif",
    }}>
      <Toaster />
      <Navbar variant="back" />

      <main className="login-main">
        {/* Left panel */}
        <div className="login-left" style={{ backgroundColor: '#151A40' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '999px',
            padding: '6px 16px', marginBottom: '32px', width: 'fit-content',
          }}>
            <MdOutlineEngineering size={16} color="#fff" />
            <span style={{ fontSize: '12px', fontWeight: '700', color: '#fff', letterSpacing: '1px', textTransform: 'uppercase' }}>
              Field Officer Portal
            </span>
          </div>

          <h1 style={{ fontSize: 'clamp(28px, 3.5vw, 48px)', fontWeight: '900', color: '#fff', lineHeight: 1.15, marginBottom: '20px' }}>
            The Digital Concierge for Resolution.
          </h1>
          <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.85)', lineHeight: 1.7, marginBottom: '48px', maxWidth: '440px' }}>
            Access the IGMS to manage tasks, verify updates, and ensure every citizen's voice is heard.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              { icon: <MdOutlineShield size={18} />, label: 'Secured Connection', sub: 'End-to-end encrypted access' },
              { icon: <MdOutlineEngineering size={18} />, label: 'Official Use Only', sub: 'Authorized personnel only' },
              { icon: <MdLockOutline size={18} />, label: 'IP Logged', sub: 'All sessions are monitored' },
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0 }}>
                  {item.icon}
                </div>
                <div>
                  <p style={{ fontSize: '14px', fontWeight: '700', color: '#fff', margin: 0 }}>{item.label}</p>
                  <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', margin: 0 }}>{item.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right panel */}
        <div className="login-right">
          <div style={{ width: '100%', maxWidth: '420px' }}>

            <div style={{ marginBottom: '32px' }}>
              <h2 style={{ fontSize: '28px', fontWeight: '900', color: '#1a1a1a', margin: '0 0 8px' }}>Officer Login</h2>
              <p style={{ fontSize: '14px', color: '#6b5e52', margin: 0 }}>
                Use credentials provided by your administrator
              </p>
            </div>

            <form onSubmit={handleLogin}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: '600', color: '#3a3a3a', marginBottom: '8px' }}>
                <MdEmail size={14} color="#151A40" /> Email Address
              </label>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="Enter your official email" required
                style={{
                  width: '100%', padding: '13px 16px', fontSize: '14px', color: '#1a1a1a',
                  border: '1.5px solid #e0d5c8', borderRadius: '12px', backgroundColor: '#faf6f0',
                  outline: 'none', marginBottom: '16px', boxSizing: 'border-box',
                }}
              />

              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: '600', color: '#3a3a3a', marginBottom: '8px' }}>
                <MdLockOutline size={14} color="#151A40" /> Password
              </label>
              <input
                type="password" value={password} onChange={e => setPassword(e.target.value)}
                placeholder="Enter your password" required
                style={{
                  width: '100%', padding: '13px 16px', fontSize: '14px', color: '#1a1a1a',
                  border: '1.5px solid #e0d5c8', borderRadius: '12px', backgroundColor: '#faf6f0',
                  outline: 'none', marginBottom: '24px', boxSizing: 'border-box',
                }}
              />

              <motion.button
                type="submit" disabled={loading}
                whileTap={{ scale: 0.97 }}
                style={{
                  width: '100%', padding: '14px', borderRadius: '12px',
                  backgroundColor: loading ? '#9e8e80' : '#151A40', color: '#fff',
                  fontSize: '15px', fontWeight: '700', border: 'none',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                }}
              >
                {loading ? 'Signing in...' : <>Officer Login <MdArrowForward size={18} /></>}
              </motion.button>
            </form>

            <p style={{ fontSize: '12px', color: '#9e8e80', marginTop: '24px', lineHeight: 1.6, textAlign: 'center' }}>
              Credentials are issued by the system administrator only.
              Your session is monitored and IP logged.
            </p>
          </div>
        </div>
      </main>

      <footer style={{ borderTop: '1px solid #e0d5c8', padding: '16px 40px', backgroundColor: '#FFF7EC', textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <MdOutlineVerifiedUser size={14} color="#41A465" />
          <span style={{ fontSize: '12px', color: '#9e8e80' }}>Protected by National Informatics Centre.</span>
          <RiGovernmentLine size={14} color="#151A40" />
          <span style={{ fontSize: '12px', color: '#9e8e80' }}>© 2024 IGMS.</span>
        </div>
      </footer>
    </div>
  )
}
