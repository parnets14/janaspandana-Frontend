import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MdArrowForward, MdEmail, MdLockOutline, MdOutlineVerifiedUser, MdOutlineShield } from 'react-icons/md'
import { RiGovernmentLine } from 'react-icons/ri'
import toast, { Toaster } from 'react-hot-toast'
import Navbar from '../components/Navbar'
import api from '../utils/secureApi'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  // Clear any existing admin session when component mounts
  useEffect(() => {
    const userRole = localStorage.getItem('userRole')
    if (userRole === 'admin') {
      // Clear all authentication data
      localStorage.removeItem('userRole')
      localStorage.removeItem('token')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('_at')
      localStorage.removeItem('_rt')
      localStorage.removeItem('_userProfile')
      try {
        sessionStorage.clear()
      } catch (e) {
        console.log('Session storage clear failed:', e)
      }
    }
  }, [])

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await api.post('/admin/login', { email, password })
      
      console.log('Login response:', response)
      
      if (response.success) {
        localStorage.removeItem('userRole')
        localStorage.setItem('userRole', 'admin')
        
        // Show success toast
        toast.success('Login successful! Redirecting...', {
          duration: 2000,
          position: 'top-center',
          style: {
            background: '#10b981',
            color: '#fff',
            fontWeight: '600'
          }
        })
        
        // Navigate to admin dashboard after a short delay
        setTimeout(() => {
          navigate('/admin/dashboard')
        }, 500)
      } else {
        setError('Login failed. Please try again.')
        toast.error('Login failed. Please try again.')
      }
    } catch (err) {
      console.error('Login error:', err)
      const errorMessage = err.response?.data?.message || err.message || 'Login failed. Please try again.'
      setError(errorMessage)
      toast.error(errorMessage, {
        duration: 3000,
        position: 'top-center'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full flex flex-col relative overflow-hidden font-[system-ui,'Segoe_UI',Roboto,sans-serif]" style={{ backgroundColor: '#ffffff' }}>
      <Toaster />


      {/* MAIN CONTENT */}
      <main style={{ flex: 1, width: '100%', maxWidth: '1152px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 1, padding: '32px' }}>
        
        {/* LOGIN CARD */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          whileHover={{ 
            y: -10,
            boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
            transition: { duration: 0.3 }
          }}
          style={{ width: '100%', maxWidth: '480px' }}
        >
          <div style={{
            backgroundColor: '#fff', border: '1px solid #ede5d8',
            borderRadius: '20px', padding: '40px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
          }}>
            
            {/* Header */}
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              style={{ textAlign: 'center', marginBottom: '32px' }}
            >
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                style={{ margin: '0 auto 20px', width: 'fit-content' }}
              >
                <img src="/logo.jpeg" alt="JaNoNi" style={{ width: '80px', height: '80px', borderRadius: '20px', objectFit: 'cover', display: 'block' }} />
              </motion.div>
              
              <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#1a1a1a', margin: '0 0 8px 0' }}>
                Admin Portal
              </h1>
              <p style={{ fontSize: '14px', color: '#666', margin: 0 }}>
                Secure access for administrators only
              </p>
            </motion.div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  padding: '12px 16px',
                  borderRadius: '10px',
                  backgroundColor: '#fee2e2',
                  border: '1px solid #fecaca',
                  marginBottom: '20px'
                }}
              >
                <p style={{ fontSize: '13px', color: '#dc2626', margin: 0 }}>{error}</p>
              </motion.div>
            )}

            {/* Login Form */}
            <motion.form 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              onSubmit={handleLogin}
            >
              {/* Email Field */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  fontSize: '14px', fontWeight: '600', color: '#1a1a1a', marginBottom: '8px',
                }}>
                  <MdEmail size={18} color="#151A40" /> Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  required
                  style={{
                    width: '100%', padding: '14px 16px', fontSize: '14px',
                    border: '1.5px solid #e0d5c8', borderRadius: '12px',
                    backgroundColor: '#faf6f0', outline: 'none',
                    color: '#1a1a1a',
                  }}
                />
              </div>

              {/* Password Field */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  fontSize: '14px', fontWeight: '600', color: '#1a1a1a', marginBottom: '8px',
                }}>
                  <MdLockOutline size={18} color="#151A40" /> Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  style={{
                    width: '100%', padding: '14px 16px', fontSize: '14px',
                    border: '1.5px solid #e0d5c8', borderRadius: '12px',
                    backgroundColor: '#faf6f0', outline: 'none',
                    color: '#1a1a1a',
                  }}
                />
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.02, y: loading ? 0 : -2 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
                style={{
                  width: '100%', padding: '16px', borderRadius: '12px',
                  backgroundColor: loading ? '#9ca3af' : '#151A40',
                  color: '#fff',
                  fontSize: '16px', fontWeight: '600', border: 'none',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center', justifyContent: 'center', gap: '8px',
                  boxShadow: loading ? 'none' : '0 4px 14px rgba(37, 150, 190, 0.4)',
                }}
              >
                {loading ? 'Logging in...' : (
                  <>
                    Login <motion.span animate={{ x: [0, 5, 0] }} transition={{ duration: 1.5, repeat: Infinity }}><MdArrowForward size={20} /></motion.span>
                  </>
                )}
              </motion.button>
            </motion.form>

            {/* Security Features */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '24px' }}
            >
              <motion.div 
                whileHover={{ y: -5, scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
                style={{ 
                  backgroundColor: '#e0f2fe', 
                  border: '1px solid #bae6fd', borderRadius: '12px', padding: '16px',
                  textAlign: 'center'
                }}
              >
                <motion.div
                  animate={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  <MdLockOutline size={24} color="#151A40" style={{ marginBottom: '8px', display: 'inline-block' }} />
                </motion.div>
                <p style={{ fontSize: '13px', fontWeight: '600', color: '#1a1a1a', margin: 0 }}>Secure & Encrypted</p>
              </motion.div>
              <motion.div 
                whileHover={{ y: -5, scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
                style={{ 
                  backgroundColor: '#e0f2fe', 
                  border: '1px solid #bae6fd', borderRadius: '12px', padding: '16px',
                  textAlign: 'center'
                }}
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                >
                  <MdOutlineShield size={24} color="#151A40" style={{ marginBottom: '8px', display: 'inline-block' }} />
                </motion.div>
                <p style={{ fontSize: '13px', fontWeight: '600', color: '#1a1a1a', margin: 0 }}>Monitored Access</p>
              </motion.div>
            </motion.div>

            {/* Footer Note */}
            <p style={{ fontSize: '11px', color: '#9e8e80', marginTop: '24px', lineHeight: '1.6', textAlign: 'center' }}>
              By logging in, you agree to the{' '}
              <a href="#" style={{ color: '#151A40', fontWeight: '600', textDecoration: 'none' }}>Official Security Policy</a>
              {' '}and{' '}
              <a href="#" style={{ color: '#151A40', fontWeight: '600', textDecoration: 'none' }}>Terms of Service</a>.
              Your IP address is being logged.
            </p>
          </div>
        </motion.div>

      </main>

      {/* FOOTER */}
      <motion.footer 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.8 }}
        style={{
          width: '100%', borderTop: '1px solid #e0d5c8',
          padding: '20px 32px', backgroundColor: '#FFF7EC',
          position: 'relative', zIndex: 1,
        }}>
        <div style={{
          maxWidth: '1152px', margin: '0 auto',
          display: 'flex', alignItems: 'center',
          justifyContent: 'center', gap: '8px', flexWrap: 'wrap',
        }}>
          <MdOutlineVerifiedUser size={15} color="#151A40" />
          <span style={{ fontSize: '12px', color: '#9e8e80' }}>Protected by National Informatics Centre.</span>
          <RiGovernmentLine size={15} color="#151A40" />
          <span style={{ fontSize: '12px', color: '#9e8e80' }}>© {new Date().getFullYear()} IGMS.</span>
        </div>
      </motion.footer>
    </div>
  )
}
