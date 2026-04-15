import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MdPhone, MdArrowForward, MdOutlineLock, MdOutlineTrackChanges, MdPerson, MdCreditCard, MdHome, MdCameraAlt, MdImage, MdPinDrop } from 'react-icons/md'
import { HiCheckBadge } from 'react-icons/hi2'
import { MdOutlineSpeed } from 'react-icons/md'
import { RiCustomerService2Line } from 'react-icons/ri'
import Navbar from '../components/Navbar'
import { authAPI } from '../utils/secureApi'

const stats = [
  { value: '12K+', label: 'Complaints Resolved', color: '#151A40', icon: <HiCheckBadge size={22} />, bg: '#EEF2FF' },
  { value: '98%',  label: 'Satisfaction Rate',   color: '#41A465', icon: <MdOutlineSpeed size={22} />, bg: '#edf7f1' },
  { value: '24/7', label: 'Support Available',   color: '#151A40', icon: <RiCustomerService2Line size={22} />, bg: '#EEF2FF' },
]

export default function LandingPage() {
  const [mobile, setMobile] = useState('')
  const [step, setStep] = useState('mobile')
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [showTrackModal, setShowTrackModal] = useState(false)
  const [complaintId, setComplaintId] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [devOTP, setDevOTP] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    aadhaar: '',
    address: '',
    pincode: '',
    photo: null,
    aadhaarPhoto: null
  })
  const [validationErrors, setValidationErrors] = useState({
    phone: '',
    aadhaar: ''
  })

  // Validation functions
  const validatePhone = (phone) => {
    if (phone.length === 0) return ''
    if (phone.length < 10) return 'Phone number must be 10 digits'
    return ''
  }

  const validateAadhaar = (aadhaar) => {
    if (aadhaar.length === 0) return ''
    if (aadhaar.length < 12) return 'Aadhaar number must be 12 digits'
    return ''
  }

  // Handle phone number change with validation
  const handlePhoneChange = (value) => {
    const cleanValue = value.replace(/\D/g, '')
    setFormData({...formData, phone: cleanValue})
    setValidationErrors({...validationErrors, phone: validatePhone(cleanValue)})
  }

  // Handle Aadhaar change with validation
  const handleAadhaarChange = (value) => {
    const cleanValue = value.replace(/\D/g, '')
    setFormData({...formData, aadhaar: cleanValue})
    setValidationErrors({...validationErrors, aadhaar: validateAadhaar(cleanValue)})
  }
  const navigate = useNavigate()

  // const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isMobile, setIsMobile] = useState(false)
  const [cameraModal, setCameraModal] = useState(null) // 'photo' | 'aadhaarPhoto' | null
  const videoRef = useRef(null)
  const streamRef = useRef(null)

  const openCamera = useCallback(async (field) => {
    setCameraModal(field)
  }, [])

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop())
      streamRef.current = null
    }
    setCameraModal(null)
  }, [])

  useEffect(() => {
    if (cameraModal && videoRef.current) {
      navigator.mediaDevices.getUserMedia({ video: { facingMode: cameraModal === 'photo' ? 'user' : 'environment' } })
        .then(stream => {
          streamRef.current = stream
          videoRef.current.srcObject = stream
        })
        .catch(() => stopCamera())
    }
  }, [cameraModal, stopCamera])

  const capturePhoto = useCallback(() => {
    const video = videoRef.current
    if (!video) return
    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    canvas.getContext('2d').drawImage(video, 0, 0)
    canvas.toBlob(blob => {
      const file = new File([blob], `${cameraModal}.jpg`, { type: 'image/jpeg' })
      setFormData(prev => ({ ...prev, [cameraModal]: file }))
      stopCamera()
    }, 'image/jpeg', 0.9)
  }, [cameraModal, stopCamera])

  const headlineWords = ['Resolution', 'is', 'a', 'promise,', 'not', 'just', 'a', 'process.']
  const subtextWords = 'Your voice matters. Access the Integrated Grievance Management System to track, resolve, and escalate your concerns with full transparency.'.split(' ')

  // const handleMouseMove = (e) => {
  //   const x = (e.clientX / window.innerWidth - 0.5) * 2
  //   const y = (e.clientY / window.innerHeight - 0.5) * 2
  //   setMousePosition({ x, y })
  // }

  // Check screen size
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const handleTrackSearch = (e) => {
    e.preventDefault()
    navigate('/track-complaint')
    setShowTrackModal(false)
  }

  // Login - Request OTP
  const handleGetOTP = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    
    try {
      const response = await authAPI.requestOTP(mobile)
      
      if (response.success) {
        // Store dev OTP for testing
        if (response.data.devOTP) {
          setDevOTP(response.data.devOTP)
          // Auto-fill OTP in development
          setOtp(response.data.devOTP.split(''))
        }
        setStep('otp')
      }
    } catch (err) {
      setError(err.message || 'Failed to send OTP. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleOtpChange = (val, idx) => {
    if (!/^\d?$/.test(val)) return
    const next = [...otp]
    next[idx] = val
    setOtp(next)
    if (val && idx < 5) document.getElementById(`citizen-otp-${idx + 1}`)?.focus()
  }

  // Login - Verify OTP
  const handleVerify = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    
    try {
      const otpString = otp.join('')
      if (otpString.length !== 6) {
        setError('Please enter complete OTP')
        setLoading(false)
        return
      }
      
      const response = await authAPI.verifyOTP(mobile, otpString)
      
      if (response.success) {
        const role = response.data.user.role
        // Cache user profile for persistent display
        localStorage.setItem('_userProfile', JSON.stringify(response.data.user))
        // Redirect based on role
        if (role === 'citizen') {
          navigate('/user/dashboard')
        } else if (role === 'operator') {
          navigate('/operator/dashboard')
        } else if (role === 'officer') {
          navigate('/officer/dashboard')
        } else {
          navigate('/user/dashboard')
        }
      }
    } catch (err) {
      setError(err.message || 'Invalid OTP. Please try again.')
      setOtp(['', '', '', '', '', ''])
      document.getElementById('citizen-otp-0')?.focus()
    } finally {
      setLoading(false)
    }
  }

  // Register - Submit form
  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    
    try {
      // Check for validation errors
      const phoneError = validatePhone(formData.phone)
      const aadhaarError = validateAadhaar(formData.aadhaar)
      
      if (phoneError || aadhaarError) {
        setValidationErrors({
          phone: phoneError,
          aadhaar: aadhaarError
        })
        setError('Please fix the validation errors above')
        setLoading(false)
        return
      }
      
      // Validate phone
      if (formData.phone.length !== 10) {
        setError('Phone number must be 10 digits')
        setLoading(false)
        return
      }
      
      // Validate aadhaar
      if (formData.aadhaar.length !== 12) {
        setError('Aadhaar number must be 12 digits')
        setLoading(false)
        return
      }
      
      const response = await authAPI.register({
        name: formData.name,
        phone: formData.phone,
        aadhaar: formData.aadhaar,
        address: formData.address,
        pincode: formData.pincode,
        photo: formData.photo ? await convertToBase64(formData.photo) : null,
        aadhaarPhoto: formData.aadhaarPhoto ? await convertToBase64(formData.aadhaarPhoto) : null
      })
      
      if (response.success) {
        // Store dev OTP for testing
        if (response.data.devOTP) {
          setDevOTP(response.data.devOTP)
          // Auto-fill OTP in development
          setOtp(response.data.devOTP.split(''))
        }
        setStep('register-otp')
      }
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleRegisterOtpChange = (val, idx) => {
    if (!/^\d?$/.test(val)) return
    const next = [...otp]
    next[idx] = val
    setOtp(next)
    if (val && idx < 5) document.getElementById(`register-otp-${idx + 1}`)?.focus()
  }

  // Register - Verify OTP
  const handleRegisterVerify = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    
    try {
      const otpString = otp.join('')
      if (otpString.length !== 6) {
        setError('Please enter complete OTP')
        setLoading(false)
        return
      }
      
      const response = await authAPI.verifyOTP(formData.phone, otpString)
      
      if (response.success) {
        if (response.data?.user) localStorage.setItem('_userProfile', JSON.stringify(response.data.user))
        navigate('/user/dashboard')
      }
    } catch (err) {
      setError(err.message || 'Invalid OTP. Please try again.')
      setOtp(['', '', '', '', '', ''])
      document.getElementById('register-otp-0')?.focus()
    } finally {
      setLoading(false)
    }
  }

  // Resend OTP
  const handleResendOTP = async () => {
    setError('')
    setLoading(true)
    
    try {
      const phone = step === 'register-otp' ? formData.phone : mobile
      const response = await authAPI.requestOTP(phone)
      
      if (response.success) {
        if (response.data.devOTP) {
          setDevOTP(response.data.devOTP)
          setOtp(response.data.devOTP.split(''))
        }
        alert('OTP sent successfully!')
      }
    } catch (err) {
      setError(err.message || 'Failed to resend OTP')
    } finally {
      setLoading(false)
    }
  }

  // Helper function to convert file to base64
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result)
      reader.onerror = error => reject(error)
    })
  }

  return (
    <div 
      // onMouseMove={handleMouseMove}
      style={{
      minHeight: '100vh',
      width: '100%',
      backgroundColor: '#FFFFFF',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: "system-ui, 'Segoe UI', Roboto, sans-serif",
      position: 'relative',
      overflow: 'hidden',
    }}>

      {/* Large floating orbs with mouse parallax */}
      {!isMobile && (
        <>
      <motion.div
        animate={{
          y: [0, -80, 0],
          rotate: [0, 180, 360],
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{
          position: 'absolute',
          top: '5%',
          left: '8%',
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(231, 83, 0, 0.2), rgba(231, 83, 0, 0.05))',
          filter: 'blur(60px)',
          zIndex: 0,
          // transform: `translate(${mousePosition.x * 30}px, ${mousePosition.y * 30}px)`,
        }}
      />
      <motion.div
        animate={{
          y: [0, 60, 0],
          rotate: [0, -180, -360],
          scale: [1, 1.4, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
        style={{
          position: 'absolute',
          top: '50%',
          right: '5%',
          width: '250px',
          height: '250px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(65, 164, 101, 0.25), rgba(65, 164, 101, 0.05))',
          filter: 'blur(70px)',
          zIndex: 0,
          // transform: `translate(${mousePosition.x * -40}px, ${mousePosition.y * -40}px)`,
        }}
      />
      <motion.div
        animate={{
          y: [0, -100, 0],
          rotate: [0, 90, 180],
          scale: [1, 1.5, 1],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 4
        }}
        style={{
          position: 'absolute',
          bottom: '10%',
          left: '20%',
          width: '180px',
          height: '180px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(231, 83, 0, 0.15), rgba(65, 164, 101, 0.1))',
          filter: 'blur(55px)',
          zIndex: 0,
          // transform: `translate(${mousePosition.x * 25}px, ${mousePosition.y * 25}px)`,
        }}
      />
        </>
      )}

      {/* Floating particles with mouse interaction */}
      {[...Array(isMobile ? 8 : 20)].map((_, i) => {
        const randomY = Math.random() * -300 - 100
        const randomX = Math.random() * 200 - 100
        const size = Math.random() * 40 + 30
        
        return (
          <motion.div
            key={i}
            animate={{
              y: [0, randomY, 0],
              x: [0, randomX, 0],
              rotate: [0, 360, 720],
              opacity: [0.2, 0.7, 0.2],
              scale: [1, 1.8, 1],
            }}
            transition={{
              duration: Math.random() * 15 + 15,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 5
            }}
            style={{
              position: 'absolute',
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${size}px`,
              height: `${size}px`,
              borderRadius: '50%',
              background: i % 3 === 0 
                ? 'radial-gradient(circle, rgba(231, 83, 0, 0.4), transparent)'
                : i % 3 === 1
                ? 'radial-gradient(circle, rgba(65, 164, 101, 0.4), transparent)'
                : 'radial-gradient(circle, rgba(255, 200, 100, 0.3), transparent)',
              filter: 'blur(25px)',
              zIndex: 0,
              pointerEvents: 'none',
              willChange: 'transform',
              backfaceVisibility: 'hidden',
            }}
          />
        )
      })}

      {/* Geometric shapes */}
      {!isMobile && [...Array(8)].map((_, i) => {
        const shapes = ['circle', 'square', 'diamond', 'triangle']
        const shape = shapes[i % 4]
        const size = Math.random() * 60 + 40
        const randomY = Math.random() * -200 - 80
        const randomX = Math.random() * 150 - 75
        
        let clipPath = 'none'
        let borderRadius = '50%'
        
        if (shape === 'square') {
          borderRadius = '15px'
        } else if (shape === 'diamond') {
          clipPath = 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)'
          borderRadius = '0'
        } else if (shape === 'triangle') {
          clipPath = 'polygon(50% 0%, 0% 100%, 100% 100%)'
          borderRadius = '0'
        }
        
        return (
          <motion.div
            key={`shape-${i}`}
            animate={{
              y: [0, randomY, 0],
              x: [0, randomX, 0],
              rotate: [0, shape === 'circle' ? 0 : 360, shape === 'circle' ? 0 : 720],
              scale: [1, 1.4, 1],
            }}
            transition={{
              duration: Math.random() * 12 + 18,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 8
            }}
            style={{
              position: 'absolute',
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${size}px`,
              height: `${size}px`,
              background: i % 2 === 0
                ? 'linear-gradient(135deg, rgba(231, 83, 0, 0.2), rgba(231, 83, 0, 0.05))'
                : 'linear-gradient(135deg, rgba(65, 164, 101, 0.2), rgba(65, 164, 101, 0.05))',
              borderRadius,
              clipPath,
              filter: 'blur(3px)',
              zIndex: 0,
              pointerEvents: 'none',
              willChange: 'transform',
              backfaceVisibility: 'hidden',
            }}
          />
        )
      })}

      {/* Animated streaks */}
      {!isMobile && [...Array(6)].map((_, i) => (
        <motion.div
          key={`line-${i}`}
          animate={{
            y: ['-100%', '200%'],
            opacity: [0, 0.5, 0],
          }}
          transition={{
            duration: Math.random() * 8 + 12,
            repeat: Infinity,
            ease: "linear",
            delay: Math.random() * 10
          }}
          style={{
            position: 'absolute',
            left: `${Math.random() * 100}%`,
            width: '2px',
            height: `${Math.random() * 100 + 100}px`,
            background: i % 2 === 0
              ? 'linear-gradient(to bottom, transparent, rgba(231, 83, 0, 0.5), transparent)'
              : 'linear-gradient(to bottom, transparent, rgba(65, 164, 101, 0.5), transparent)',
            filter: 'blur(1px)',
            zIndex: 0,
            pointerEvents: 'none',
            willChange: 'transform',
          }}
        />
      ))}

      {/* Pulsing rings */}
      {!isMobile && [...Array(4)].map((_, i) => (
        <motion.div
          key={`ring-${i}`}
          animate={{
            scale: [1, 2.5, 1],
            opacity: [0.4, 0, 0.4],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeOut",
            delay: i * 2
          }}
          style={{
            position: 'absolute',
            top: `${20 + i * 20}%`,
            left: `${10 + i * 20}%`,
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            border: `3px solid ${i % 2 === 0 ? 'rgba(231, 83, 0, 0.4)' : 'rgba(65, 164, 101, 0.4)'}`,
            zIndex: 0,
            pointerEvents: 'none',
          }}
        />
      ))}

      {/* Gradient waves */}
      <motion.div
        animate={{
          x: ['-100%', '100%'],
          opacity: [0.05, 0.15, 0.05],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "linear"
        }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '200%',
          height: '100%',
          background: 'linear-gradient(90deg, transparent, rgba(231, 83, 0, 0.08), transparent)',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />
      <motion.div
        animate={{
          x: ['100%', '-100%'],
          opacity: [0.05, 0.12, 0.05],
        }}
        transition={{
          duration: 35,
          repeat: Infinity,
          ease: "linear",
          delay: 5
        }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '200%',
          height: '100%',
          background: 'linear-gradient(90deg, transparent, rgba(65, 164, 101, 0.08), transparent)',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />

      <Navbar variant="landing" onTrackClick={() => setShowTrackModal(true)} />

      {/* Track Complaint Modal */}
      {showTrackModal && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowTrackModal(false)}
            style={{
              position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 999,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="track-modal"
            style={{
            position: 'fixed', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)', zIndex: 1000,
            backgroundColor: '#fff', borderRadius: '20px',
            padding: '32px', width: '90%', maxWidth: '460px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            maxHeight: '90vh',
            overflowY: 'auto',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
              <div style={{ width: '4px', height: '24px', borderRadius: '4px', backgroundColor: '#41A465' }} />
              <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#1a1a1a', margin: 0 }}>
                🔍 Track Your Complaint
              </h2>
            </div>

            <form onSubmit={handleTrackSearch}>
              <label style={{ fontSize: '14px', fontWeight: '600', color: '#3a3a3a', marginBottom: '8px', display: 'block' }}>
                Enter Complaint ID
              </label>
              <input 
                type="text" 
                required 
                value={complaintId}
                onChange={e => setComplaintId(e.target.value.toUpperCase())}
                placeholder="IGMS-2024-001234"
                style={{
                  width: '100%', padding: '14px 16px', fontSize: '15px',
                  border: '1.5px solid #374151', borderRadius: '12px',
                  backgroundColor: '#F8F9FA', outline: 'none', marginBottom: '8px',
                  fontWeight: '600', letterSpacing: '0.5px',
                }}
              />
              <p style={{ fontSize: '12px', color: '#9e8e80', marginBottom: '24px' }}>
                💡 Find your Complaint ID in SMS or Email confirmation
              </p>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button 
                  type="button"
                  onClick={() => setShowTrackModal(false)}
                  style={{
                    flex: 1, padding: '13px', borderRadius: '12px',
                    backgroundColor: '#F0F0F0', border: '1px solid #E5E7EB',
                    color: '#555', fontSize: '15px', fontWeight: '600',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  style={{
                    flex: 1, padding: '13px', borderRadius: '12px',
                    backgroundColor: '#41A465', border: 'none',
                    color: '#fff', fontSize: '15px', fontWeight: '600',
                    cursor: 'pointer', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', gap: '8px',
                  }}
                >
                  Search Status <MdArrowForward size={18} />
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}

      {/* MAIN CONTENT */}
      <main style={{ flex: 1, width: '100%', maxWidth: '1152px', margin: '0 auto', display: 'flex', alignItems: 'center', position: 'relative', zIndex: 1 }} className="nav-pad">
        <div className="hero-layout">

          {/* HERO SECTION */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{ flex: 1, paddingTop: '0px', marginTop: '-40px' }}
          >
            {/* Badge */}
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              style={{ marginBottom: '24px' }}
            >
              <motion.span 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                display: 'inline-block', padding: '5px 14px',
                borderRadius: '999px', backgroundColor: '#41A465',
                color: '#fff', fontSize: '11px', fontWeight: '700',
                letterSpacing: '1.5px', textTransform: 'uppercase',
              }}>
                Official Grievance Portal
              </motion.span>
            </motion.div>

            {/* Headline with word-by-word animation */}
            <motion.h1 
              style={{
              fontSize: 'clamp(36px, 5vw, 60px)', fontWeight: '900',
              lineHeight: '1.15', color: '#1a1a1a',
              marginBottom: '20px', maxWidth: '560px',
            }}>
              {isMobile ? (
                // Simple fade-in on mobile
                <motion.span
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                >
                  Resolution is a <span style={{ color: '#151A40' }}>promise,</span> not just a process.
                </motion.span>
              ) : (
                // Word-by-word on desktop
                headlineWords.map((word, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      delay: 0.4 + i * 0.15,
                      duration: 0.5,
                      ease: "easeOut"
                    }}
                    style={{ 
                      display: 'inline-block',
                      marginRight: word === 'promise,' ? '0' : '0.3em',
                      color: word === 'promise,' ? '#151A40' : '#1a1a1a'
                    }}
                  >
                    {word === 'promise,' ? (
                      <motion.span
                        animate={{ 
                          y: [0, -8, 0],
                        }}
                        transition={{ 
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: 2
                        }}
                        style={{ display: 'inline-block' }}
                      >
                        {word}
                      </motion.span>
                    ) : word}
                  </motion.span>
                ))
              )}
            </motion.h1>

            {/* Subtext with word-by-word animation */}
            <motion.p 
              style={{
              fontSize: '16px', lineHeight: '1.7', color: '#6b5e52',
              maxWidth: '460px', marginBottom: '48px',
            }}>
              {isMobile ? (
                // Simple fade-in on mobile
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                >
                  Your voice matters. Access the Integrated Grievance Management System to track, resolve, and escalate your concerns with full transparency.
                </motion.span>
              ) : (
                // Word-by-word on desktop
                subtextWords.map((word, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ 
                      delay: 2.2 + i * 0.05,
                      duration: 0.3
                    }}
                    style={{ display: 'inline-block', marginRight: '0.25em' }}
                  >
                    {word}
                  </motion.span>
                ))
              )}
            </motion.p>

            {/* Stats */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: isMobile ? 1 : 3.5, duration: 0.8 }}
              className="stats-container"
            >
              {stats.map((stat, i) => (
                <motion.div 
                  key={stat.label} 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: isMobile ? 1.2 + i * 0.1 : 3.7 + i * 0.1, duration: 0.5 }}
                  whileHover={{ 
                    y: -8,
                    transition: { duration: 0.3 }
                  }}
                  style={{ display: 'flex', alignItems: 'center' }}
                >
                  {i > 0 && (
                    <div className="stats-divider" style={{ width: '1px', height: '48px', backgroundColor: '#E5E7EB', margin: '0 28px' }} />
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <motion.div 
                      style={{
                      width: '44px', height: '44px', borderRadius: '12px',
                      backgroundColor: stat.bg, display: 'flex',
                      alignItems: 'center', justifyContent: 'center', color: stat.color,
                    }}>
                      {stat.icon}
                    </motion.div>
                    <div>
                      <p style={{ fontSize: '26px', fontWeight: '800', color: stat.color, lineHeight: 1, margin: 0 }}>
                        {stat.value}
                      </p>
                      <p style={{ fontSize: '12px', color: '#6b5e52', marginTop: '3px', margin: 0 }}>
                        {stat.label}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* LOGIN CARD */}
          <motion.div 
            initial={{ opacity: 0, x: 50, rotateY: -15 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
            whileHover={{ 
              y: -10,
              boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
              transition: { duration: 0.3 }
            }}
            style={{ width: '100%', maxWidth: '420px', flexShrink: 0, marginTop: '20px' }}
          >
            <div style={{
              backgroundColor: '#fff', border: '1px solid #E5E7EB',
              borderRadius: '20px', padding: '32px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
            }}>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}
              >
                <motion.div 
                  animate={{ scaleY: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  style={{ width: '4px', height: '24px', borderRadius: '4px', backgroundColor: '#151A40' }}
                />
                <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#1a1a1a', margin: 0 }}>
                  Citizen Login
                </h2>
              </motion.div>

              {step === 'mobile' ? (
              <motion.form 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                onSubmit={handleGetOTP}
              >
                {error && (
                  <div style={{
                    padding: '12px', borderRadius: '10px',
                    backgroundColor: '#fef2f2', border: '1px solid #fecaca',
                    marginBottom: '16px'
                  }}>
                    <p style={{ fontSize: '13px', color: '#dc2626', margin: 0 }}>
                      ⚠️ {error}
                    </p>
                  </div>
                )}

                <label style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  fontSize: '14px', fontWeight: '500', color: '#3a3a3a', marginBottom: '8px',
                }}>
                  <MdPhone size={16} color="#151A40" /> Mobile Number
                </label>

                <div style={{
                  display: 'flex', alignItems: 'center',
                  border: '1.5px solid #374151', borderRadius: '12px',
                  overflow: 'hidden', backgroundColor: '#F8F9FA', marginBottom: '8px',
                }}>
                  <span style={{
                    padding: '12px 16px', fontSize: '14px', fontWeight: '600',
                    color: '#555', backgroundColor: '#F0F0F0',
                    borderRight: '1px solid #374151', whiteSpace: 'nowrap',
                  }}>
                    +91
                  </span>
                  <input
                    type="tel"
                    maxLength={10}
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                    placeholder="Enter 10 digit number"
                    required
                    disabled={loading}
                    style={{
                      flex: 1, padding: '12px 16px', fontSize: '14px',
                      color: '#1a1a1a', backgroundColor: 'transparent',
                      border: 'none', outline: 'none',
                    }}
                  />
                </div>

                <p style={{ fontSize: '12px', color: '#9e8e80', marginBottom: '20px' }}>
                  We will send a secure 6-digit OTP to this number.
                </p>

                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: loading ? 1 : 1.02, y: loading ? 0 : -2 }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                  style={{
                    width: '100%', padding: '14px', borderRadius: '12px',
                    backgroundColor: loading ? '#9e8e80' : '#151A40', 
                    color: '#fff',
                    fontSize: '16px', fontWeight: '600', border: 'none',
                    cursor: loading ? 'not-allowed' : 'pointer', 
                    display: 'flex',
                    alignItems: 'center', justifyContent: 'center', gap: '8px',
                  }}
                >
                  {loading ? 'Sending...' : 'Get OTP'} 
                  {!loading && <motion.span animate={{ x: [0, 5, 0] }} transition={{ duration: 1.5, repeat: Infinity }}><MdArrowForward size={20} /></motion.span>}
                </motion.button>

                <p style={{ textAlign: 'center', fontSize: '13px', color: '#6b5e52', marginTop: '16px' }}>
                  New User?{' '}
                  <button 
                    type="button" 
                    onClick={() => { setStep('register'); setFormData({...formData, phone: mobile}); setError(''); }}
                    style={{ background: 'none', border: 'none', color: '#151A40', fontWeight: '600', cursor: 'pointer', fontSize: '13px', textDecoration: 'underline' }}
                  >
                    Register Here
                  </button>
                </p>
              </motion.form>
              ) : step === 'otp' ? (
              <motion.form 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                onSubmit={handleVerify}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                  <button type="button" onClick={() => { setStep('mobile'); setError(''); setOtp(['', '', '', '', '', '']); }} style={{ background: 'none', border: 'none', color: '#6b5e52', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', padding: 0 }}>
                    ← Back
                  </button>
                  <p style={{ fontSize: '13px', color: '#6b5e52', margin: 0 }}>OTP sent to <strong>+91 {mobile}</strong></p>
                </div>

                {error && (
                  <div style={{
                    padding: '12px', borderRadius: '10px',
                    backgroundColor: '#fef2f2', border: '1px solid #fecaca',
                    marginBottom: '16px'
                  }}>
                    <p style={{ fontSize: '13px', color: '#dc2626', margin: 0 }}>
                      ⚠️ {error}
                    </p>
                  </div>
                )}

                {devOTP && (
                  <div style={{ 
                    padding: '12px 16px', 
                    borderRadius: '10px', 
                    backgroundColor: '#EEF2FF', 
                    border: '1px solid #fcd9c0',
                    marginBottom: '16px',
                    textAlign: 'center'
                  }}>
                    <p style={{ fontSize: '12px', color: '#9e8e80', margin: '0 0 4px' }}>Dev OTP (for testing)</p>
                    <p style={{ fontSize: '20px', fontWeight: '700', color: '#151A40', margin: 0, letterSpacing: '4px' }}>{devOTP}</p>
                  </div>
                )}

                <div className="otp-inputs" style={{ display: 'flex', gap: '8px', marginBottom: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
                  {otp.map((d, i) => (
                    <motion.input 
                      key={i} 
                      id={`citizen-otp-${i}`}
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      whileFocus={{ scale: 1.1, borderColor: '#151A40' }}
                      type="text" inputMode="numeric" maxLength={1} value={d}
                      onChange={e => handleOtpChange(e.target.value, i)}
                      disabled={loading}
                      style={{
                        width: '44px', height: '52px', textAlign: 'center',
                        fontSize: '22px', fontWeight: '700', borderRadius: '10px',
                        border: d ? '2px solid #151A40' : '1.5px solid #374151',
                        backgroundColor: d ? '#EEF2FF' : '#F8F9FA',
                        color: '#1a1a1a', outline: 'none',
                      }}
                    />
                  ))}
                </div>
                <motion.button 
                  type="submit" 
                  disabled={loading}
                  whileHover={{ scale: loading ? 1 : 1.02, y: loading ? 0 : -2 }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                  style={{
                  width: '100%', padding: '14px', borderRadius: '12px',
                  backgroundColor: loading ? '#9e8e80' : '#151A40', 
                  color: '#fff', fontSize: '16px',
                  fontWeight: '600', border: 'none', 
                  cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                }}>
                  {loading ? 'Verifying...' : 'Verify & Login'} {!loading && <MdArrowForward size={20} />}
                </motion.button>
                <p style={{ textAlign: 'center', fontSize: '12px', color: '#9e8e80', marginTop: '12px' }}>
                  Didn't receive?{' '}
                  <button type="button" onClick={handleResendOTP} disabled={loading} style={{ background: 'none', border: 'none', color: '#151A40', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer', fontSize: '12px' }}>Resend OTP</button>
                </p>
              </motion.form>
              ) : step === 'register' ? (
              <motion.form 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                onSubmit={handleRegister}
              >
                <div style={{ marginBottom: '10px' }}>
                  <button type="button" onClick={() => { setStep('mobile'); setError(''); }} style={{ background: 'none', border: 'none', color: '#6b5e52', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', padding: 0, marginBottom: '8px' }}>
                    ← Back
                  </button>
                  <h3 style={{ fontSize: '17px', fontWeight: '700', color: '#1a1a1a', margin: '0 0 4px' }}>New User Registration</h3>
                  <p style={{ fontSize: '12px', color: '#6b5e52', margin: 0 }}>Complete your profile to continue</p>
                </div>

                {error && (
                  <div style={{
                    padding: '8px 12px', borderRadius: '8px',
                    backgroundColor: '#fef2f2', border: '1px solid #fecaca',
                    marginBottom: '10px'
                  }}>
                    <p style={{ fontSize: '12px', color: '#dc2626', margin: 0 }}>⚠️ {error}</p>
                  </div>
                )}

                <div style={{ marginBottom: '10px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: '600', color: '#3a3a3a', marginBottom: '4px' }}>
                    <MdPerson size={14} color="#151A40" /> Full Name (As Per Aadhaar)*
                  </label>
                  <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                    placeholder="Enter your full name"
                    disabled={loading}
                    style={{ width: '100%', padding: '9px 12px', fontSize: '13px', border: '1.5px solid #374151', borderRadius: '9px', backgroundColor: '#F8F9FA', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>

                <div style={{ marginBottom: '10px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: '600', color: '#3a3a3a', marginBottom: '4px' }}>
                    <MdPhone size={14} color="#151A40" /> Phone Number *
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', border: `1.5px solid ${validationErrors.phone ? '#ef4444' : '#374151'}`, borderRadius: '9px', overflow: 'hidden', backgroundColor: '#F8F9FA' }}>
                    <span style={{ padding: '9px 12px', fontSize: '13px', fontWeight: '600', color: '#555', backgroundColor: '#F0F0F0', borderRight: '1px solid #374151', whiteSpace: 'nowrap' }}>+91</span>
                    <input type="tel" required maxLength={10} value={formData.phone} onChange={e => handlePhoneChange(e.target.value)}
                      placeholder="Enter 10 digit number"
                      disabled={loading}
                      style={{ flex: 1, padding: '9px 12px', fontSize: '13px', border: 'none', backgroundColor: 'transparent', outline: 'none', color: '#1a1a1a' }}
                    />
                  </div>
                  {validationErrors.phone && (
                    <p style={{ fontSize: '11px', color: '#ef4444', margin: '3px 0 0', fontWeight: '500' }}>
                      ⚠️ {validationErrors.phone}
                    </p>
                  )}
                </div>

                <div style={{ marginBottom: '10px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: '600', color: '#3a3a3a', marginBottom: '4px' }}>
                    <MdCreditCard size={14} color="#151A40" /> Aadhaar Number *
                  </label>
                  <input type="text" required maxLength={12} value={formData.aadhaar} onChange={e => handleAadhaarChange(e.target.value)}
                    placeholder="Enter 12 digit Aadhaar"
                    disabled={loading}
                    style={{ width: '100%', padding: '9px 12px', fontSize: '13px', border: `1.5px solid ${validationErrors.aadhaar ? '#ef4444' : '#374151'}`, borderRadius: '9px', backgroundColor: '#F8F9FA', outline: 'none', boxSizing: 'border-box' }}
                  />
                  {validationErrors.aadhaar && (
                    <p style={{ fontSize: '11px', color: '#ef4444', margin: '3px 0 0', fontWeight: '500' }}>
                      ⚠️ {validationErrors.aadhaar}
                    </p>
                  )}
                </div>

                <div style={{ marginBottom: '10px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: '600', color: '#3a3a3a', marginBottom: '4px' }}>
                    <MdHome size={14} color="#151A40" /> Address
                  </label>
                  <textarea value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})}
                    placeholder="Enter your address"
                    rows={2}
                    disabled={loading}
                    style={{ width: '100%', padding: '9px 12px', fontSize: '13px', border: '1.5px solid #374151', borderRadius: '9px', backgroundColor: '#F8F9FA', outline: 'none', fontFamily: 'inherit', resize: 'none', boxSizing: 'border-box' }}
                  />
                </div>

                {/* Pincode */}
                <PincodeField
                  value={formData.pincode}
                  disabled={loading}
                  onChange={val => setFormData(p => ({ ...p, pincode: val }))}
                />

                {/* Profile Picture - Required */}
                <div style={{ marginBottom: '10px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: '600', color: '#3a3a3a', marginBottom: '4px' }}>
                    <MdCameraAlt size={14} color="#151A40" /> Profile Picture *
                  </label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      type="button"
                      onClick={() => openCamera('photo')}
                      disabled={loading}
                      style={{ 
                        flex: 1, padding: '9px', fontSize: '12px', fontWeight: '600', 
                        border: '1.5px solid #374151', borderRadius: '9px', 
                        backgroundColor: formData.photo ? '#edf7f1' : '#F8F9FA', 
                        cursor: loading ? 'not-allowed' : 'pointer', 
                        color: formData.photo ? '#41A465' : '#555', 
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px',
                      }}>
                      <MdCameraAlt size={15} /> {formData.photo ? '✓ Camera' : 'Camera'}
                    </button>
                    <label style={{ 
                      flex: 1, padding: '9px', fontSize: '12px', fontWeight: '600', 
                      border: '1.5px solid #374151', borderRadius: '9px', 
                      backgroundColor: formData.photo ? '#edf7f1' : '#F8F9FA', 
                      cursor: loading ? 'not-allowed' : 'pointer', 
                      color: formData.photo ? '#41A465' : '#555', 
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px',
                    }}>
                      <MdImage size={15} /> {formData.photo ? '✓ Gallery' : 'Gallery'}
                      <input type="file" accept="image/*" onChange={e => setFormData({...formData, photo: e.target.files[0]})} disabled={loading} style={{ display: 'none' }} />
                    </label>
                  </div>
                  {formData.photo && (
                    <div style={{ 
                      marginTop: '10px', 
                      padding: '10px', 
                      borderRadius: '8px', 
                      backgroundColor: '#edf7f1', 
                      border: '1px solid #c8e6d7',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        backgroundColor: '#41A465',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        fontSize: '18px',
                        fontWeight: '700'
                      }}>
                        ✓
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: '12px', fontWeight: '600', color: '#41A465', margin: '0 0 2px' }}>
                          Photo Selected
                        </p>
                        <p style={{ fontSize: '11px', color: '#6b5e52', margin: 0 }}>
                          {formData.photo.name}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setFormData({...formData, photo: null})}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '6px',
                          border: '1px solid #c8e6d7',
                          backgroundColor: '#fff',
                          color: '#dc2626',
                          fontSize: '11px',
                          fontWeight: '600',
                          cursor: 'pointer'
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  )}
                  {!formData.photo && (
                    <p style={{ fontSize: '11px', color: '#dc2626', marginTop: '6px', textAlign: 'center' }}>
                      * Profile picture is required
                    </p>
                  )}
                </div>

                {/* Aadhaar Card Image - Optional */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: '600', color: '#3a3a3a', marginBottom: '8px' }}>
                    <MdCreditCard size={16} color="#151A40" /> Aadhaar Card Photo (Optional)
                  </label>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      type="button"
                      onClick={() => openCamera('aadhaarPhoto')}
                      disabled={loading}
                      style={{ 
                        flex: 1, padding: '14px', fontSize: '13px', fontWeight: '600', 
                        border: '1.5px dashed #374151', borderRadius: '10px', 
                        backgroundColor: formData.aadhaarPhoto ? '#EEF2FF' : '#F8F9FA', 
                        cursor: loading ? 'not-allowed' : 'pointer', 
                        textAlign: 'center', 
                        color: formData.aadhaarPhoto ? '#151A40' : '#9e8e80', 
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                        transition: 'all 0.2s'
                      }}>
                      <MdCameraAlt size={18} /> 
                      {formData.aadhaarPhoto ? '✓ Camera' : 'Camera'}
                    </button>
                    <label style={{ 
                      flex: 1, padding: '14px', fontSize: '13px', fontWeight: '600', 
                      border: '1.5px dashed #374151', borderRadius: '10px', 
                      backgroundColor: formData.aadhaarPhoto ? '#EEF2FF' : '#F8F9FA', 
                      cursor: loading ? 'not-allowed' : 'pointer', 
                      textAlign: 'center', 
                      color: formData.aadhaarPhoto ? '#151A40' : '#9e8e80', 
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                      transition: 'all 0.2s'
                    }}>
                      <MdImage size={18} /> 
                      {formData.aadhaarPhoto ? '✓ Gallery' : 'Gallery'}
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={e => setFormData({...formData, aadhaarPhoto: e.target.files[0]})}
                        disabled={loading}
                        style={{ display: 'none' }}
                      />
                    </label>
                  </div>
                  {formData.aadhaarPhoto && (
                    <div style={{ 
                      marginTop: '10px', 
                      padding: '10px', 
                      borderRadius: '8px', 
                      backgroundColor: '#EEF2FF', 
                      border: '1px solid #fcd9c0',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '8px',
                        backgroundColor: '#151A40',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        fontSize: '18px',
                        fontWeight: '700'
                      }}>
                        ✓
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: '12px', fontWeight: '600', color: '#151A40', margin: '0 0 2px' }}>
                          Aadhaar Photo Selected
                        </p>
                        <p style={{ fontSize: '11px', color: '#6b5e52', margin: 0 }}>
                          {formData.aadhaarPhoto.name}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setFormData({...formData, aadhaarPhoto: null})}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '6px',
                          border: '1px solid #fcd9c0',
                          backgroundColor: '#fff',
                          color: '#dc2626',
                          fontSize: '11px',
                          fontWeight: '600',
                          cursor: 'pointer'
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  )}
                  <p style={{ fontSize: '11px', color: '#9e8e80', marginTop: '6px', textAlign: 'center' }}>
                    Optional: Upload for faster verification
                  </p>
                </div>

                <motion.button 
                  type="submit" 
                  disabled={loading || !formData.photo || validationErrors.phone || validationErrors.aadhaar}
                  whileHover={{ scale: (loading || !formData.photo || validationErrors.phone || validationErrors.aadhaar) ? 1 : 1.02, y: (loading || !formData.photo || validationErrors.phone || validationErrors.aadhaar) ? 0 : -2 }}
                  whileTap={{ scale: (loading || !formData.photo || validationErrors.phone || validationErrors.aadhaar) ? 1 : 0.98 }}
                  style={{
                  width: '100%', padding: '14px', borderRadius: '12px',
                  backgroundColor: (loading || !formData.photo || validationErrors.phone || validationErrors.aadhaar) ? '#9e8e80' : '#151A40', 
                  color: '#fff', fontSize: '16px',
                  fontWeight: '600', border: 'none', 
                  cursor: (loading || !formData.photo || validationErrors.phone || validationErrors.aadhaar) ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                }}>
                  {loading ? 'Registering...' : !formData.photo ? 'Upload Profile Picture' : (validationErrors.phone || validationErrors.aadhaar) ? 'Fix Validation Errors' : 'Continue'} {!loading && formData.photo && !validationErrors.phone && !validationErrors.aadhaar && <MdArrowForward size={20} />}
                </motion.button>

                <p style={{ textAlign: 'center', fontSize: '13px', color: '#6b5e52', marginTop: '16px' }}>
                  Already have an account?{' '}
                  <button 
                    type="button" 
                    onClick={() => { setStep('mobile'); setError(''); }}
                    style={{ background: 'none', border: 'none', color: '#151A40', fontWeight: '600', cursor: 'pointer', fontSize: '13px', textDecoration: 'underline' }}
                  >
                    Back to Login
                  </button>
                </p>
              </motion.form>
              ) : step === 'register-otp' ? (
              <motion.form 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                onSubmit={handleRegisterVerify}
              >
                <div style={{ marginBottom: '20px' }}>
                  <button type="button" onClick={() => { setStep('register'); setError(''); setOtp(['', '', '', '', '', '']); }} style={{ background: 'none', border: 'none', color: '#6b5e52', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', padding: 0, marginBottom: '12px' }}>
                    ← Back
                  </button>
                  <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1a1a1a', margin: '0 0 6px' }}>Verify Your Number</h3>
                  <p style={{ fontSize: '13px', color: '#6b5e52', margin: 0 }}>OTP sent to <strong>+91 {formData.phone}</strong></p>
                </div>

                {error && (
                  <div style={{
                    padding: '12px', borderRadius: '10px',
                    backgroundColor: '#fef2f2', border: '1px solid #fecaca',
                    marginBottom: '16px'
                  }}>
                    <p style={{ fontSize: '13px', color: '#dc2626', margin: 0 }}>
                      ⚠️ {error}
                    </p>
                  </div>
                )}

                {devOTP && (
                  <div style={{ 
                    padding: '12px 16px', 
                    borderRadius: '10px', 
                    backgroundColor: '#edf7f1', 
                    border: '1px solid #c8e6d7',
                    marginBottom: '16px',
                    textAlign: 'center'
                  }}>
                    <p style={{ fontSize: '12px', color: '#9e8e80', margin: '0 0 4px' }}>Dev OTP (for testing)</p>
                    <p style={{ fontSize: '20px', fontWeight: '700', color: '#41A465', margin: 0, letterSpacing: '4px' }}>{devOTP}</p>
                  </div>
                )}

                <div className="otp-inputs" style={{ display: 'flex', gap: '8px', marginBottom: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
                  {otp.map((d, i) => (
                    <motion.input 
                      key={i} 
                      id={`register-otp-${i}`}
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      whileFocus={{ scale: 1.1 }}
                      type="text" inputMode="numeric" maxLength={1} value={d}
                      onChange={e => handleRegisterOtpChange(e.target.value, i)}
                      disabled={loading}
                      style={{
                        width: '44px', height: '52px', textAlign: 'center',
                        fontSize: '22px', fontWeight: '700', borderRadius: '10px',
                        border: d ? '2px solid #151A40' : '1.5px solid #374151',
                        backgroundColor: d ? '#EEF2FF' : '#F8F9FA',
                        color: '#1a1a1a', outline: 'none',
                      }}
                    />
                  ))}
                </div>
                <motion.button 
                  type="submit" 
                  disabled={loading}
                  whileHover={{ scale: loading ? 1 : 1.02, y: loading ? 0 : -2 }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                  style={{
                  width: '100%', padding: '14px', borderRadius: '12px',
                  backgroundColor: loading ? '#9e8e80' : '#151A40', 
                  color: '#fff', fontSize: '16px',
                  fontWeight: '600', border: 'none', 
                  cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                }}>
                  {loading ? 'Verifying...' : 'Complete Registration'} {!loading && <MdArrowForward size={20} />}
                </motion.button>
                <p style={{ textAlign: 'center', fontSize: '12px', color: '#9e8e80', marginTop: '12px' }}>
                  Didn't receive?{' '}
                  <button type="button" onClick={handleResendOTP} disabled={loading} style={{ background: 'none', border: 'none', color: '#151A40', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer', fontSize: '12px' }}>Resend OTP</button>
                </p>
              </motion.form>
              ) : null}

              {/* Feature tiles */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '20px' }}
              >
                <motion.div 
                  whileHover={{ y: -5, scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  style={{ backgroundColor: '#F8F9FA', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '16px' }}
                >
                  <motion.div>
                    <MdOutlineLock size={24} color="#151A40" style={{ marginBottom: '8px', display: 'block' }} />
                  </motion.div>
                  <p style={{ fontSize: '13px', fontWeight: '600', color: '#1a1a1a', margin: 0 }}>Secure &amp; Encrypted</p>
                </motion.div>
                <motion.div 
                  whileHover={{ y: -5, scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  style={{ backgroundColor: '#F8F9FA', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '16px' }}
                >
                  <motion.div>
                    <MdOutlineTrackChanges size={24} color="#41A465" style={{ marginBottom: '8px', display: 'block' }} />
                  </motion.div>
                  <p style={{ fontSize: '13px', fontWeight: '600', color: '#1a1a1a', margin: 0 }}>24/7 Status Tracking</p>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>

        </div>
      </main>

      {/* FOOTER */}
      <motion.footer 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 4, duration: 0.8 }}
        style={{
        width: '100%', borderTop: '1px solid #E5E7EB',
        padding: '20px 32px', backgroundColor: '#FFFFFF',
        position: 'relative', zIndex: 1,
       }}>
        <div style={{
          maxWidth: '1152px', margin: '0 auto',
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '12px', color: '#9e8e80' }}>© {new Date().getFullYear()} JaNoNi. All rights reserved.</span>
            <span style={{ fontSize: '12px', color: '#d0c5b8' }}>•</span>
            <span style={{ fontSize: '12px', color: '#9e8e80' }}>
              Developed by{' '}
              <a 
                href="https://parnetsgroup.com" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ color: '#151A40', fontWeight: '600', textDecoration: 'none' }}
              >
                Parnets Software India Pvt Ltd
              </a>
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <motion.a 
              href="#" 
              onClick={e => { e.preventDefault(); navigate('/officer-login'); }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              style={{
                fontSize: '12px', color: '#6b5e52', fontWeight: '600',
                textDecoration: 'none', padding: '6px 12px',
                borderRadius: '6px', backgroundColor: '#F0F0F0',
                border: '1px solid #E5E7EB',
              }}
            >
              � Officer Login
            </motion.a>
            <motion.a 
              href="#" 
              onClick={e => { e.preventDefault(); navigate('/admin-login'); }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              style={{
                fontSize: '12px', color: '#6b5e52', fontWeight: '600',
                textDecoration: 'none', padding: '6px 12px',
                borderRadius: '6px', backgroundColor: '#F0F0F0',
                border: '1px solid #E5E7EB',
              }}
            >
              🔐 Admin Login
            </motion.a>
          </div>
        </div>
      </motion.footer>

      {/* Camera Modal */}
      {cameraModal && (
        <div style={{
          position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)',
          zIndex: 9999, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: '16px', padding: '20px'
        }}>
          <p style={{ color: '#fff', fontSize: '14px', fontWeight: '600', margin: 0 }}>
            {cameraModal === 'photo' ? 'Take Profile Picture' : 'Scan Aadhaar Card'}
          </p>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            style={{ width: '100%', maxWidth: '480px', borderRadius: '12px', background: '#000' }}
          />
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              type="button"
              onClick={capturePhoto}
              style={{
                padding: '12px 28px', borderRadius: '50px', border: 'none',
                backgroundColor: '#151A40', color: '#fff', fontSize: '15px',
                fontWeight: '700', cursor: 'pointer', display: 'flex',
                alignItems: 'center', gap: '8px'
              }}
            >
              <MdCameraAlt size={20} /> Capture
            </button>
            <button
              type="button"
              onClick={stopCamera}
              style={{
                padding: '12px 28px', borderRadius: '50px', border: '1.5px solid #fff',
                backgroundColor: 'transparent', color: '#fff', fontSize: '15px',
                fontWeight: '600', cursor: 'pointer'
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

    </div>
  )
}

// Pincode field with India Post API lookup
function PincodeField({ value, onChange, disabled }) {
  const [info, setInfo] = useState(null)   // { city, state }
  const [status, setStatus] = useState('') // 'loading' | 'found' | 'invalid' | ''

  const lookup = async (pin) => {
    if (pin.length !== 6) { setInfo(null); setStatus(''); return }
    setStatus('loading')
    try {
      const res = await fetch(`https://api.postalpincode.in/pincode/${pin}`)
      const data = await res.json()
      if (data[0]?.Status === 'Success' && data[0]?.PostOffice?.length > 0) {
        const po = data[0].PostOffice[0]
        setInfo({ city: po.District, state: po.State })
        setStatus('found')
      } else {
        setInfo(null)
        setStatus('invalid')
      }
    } catch {
      setInfo(null)
      setStatus('invalid')
    }
  }

  const handleChange = (e) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 6)
    onChange(val)
    lookup(val)
  }

  return (
    <div style={{ marginBottom: '10px' }}>
      <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: '600', color: '#3a3a3a', marginBottom: '4px' }}>
        <MdPinDrop size={14} color="#151A40" /> Pincode
      </label>
      <input
        type="text" inputMode="numeric" maxLength={6}
        value={value} onChange={handleChange} disabled={disabled}
        placeholder="Enter 6-digit pincode"
        style={{
          width: '100%', padding: '9px 12px', fontSize: '13px',
          border: `1.5px solid ${status === 'found' ? '#41A465' : status === 'invalid' ? '#ef4444' : '#374151'}`,
          borderRadius: '9px', backgroundColor: '#F8F9FA', outline: 'none', boxSizing: 'border-box',
        }}
      />
      {status === 'loading' && (
        <p style={{ fontSize: '11px', color: '#9e8e80', margin: '3px 0 0' }}>Looking up pincode...</p>
      )}
      {status === 'found' && info && (
        <p style={{ fontSize: '11px', color: '#41A465', margin: '3px 0 0', fontWeight: '600' }}>
          ✓ {info.city}, {info.state}
        </p>
      )}
      {status === 'invalid' && (
        <p style={{ fontSize: '11px', color: '#ef4444', margin: '3px 0 0' }}>Invalid pincode</p>
      )}
    </div>
  )
}
