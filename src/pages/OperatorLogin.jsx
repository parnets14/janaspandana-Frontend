import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MdArrowBack, MdArrowForward, MdPhone, MdOutlineVerifiedUser, MdOutlineShield, MdLockOutline } from 'react-icons/md'
import { RiBuildingLine, RiGovernmentLine } from 'react-icons/ri'
import Navbar from '../components/Navbar'

export default function OperatorLogin() {
  const [mobile, setMobile] = useState('')
  const [step, setStep] = useState('mobile')
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const navigate = useNavigate()

  const handleGetOTP = (e) => {
    e.preventDefault()
    setStep('otp')
  }

  const handleOtpChange = (val, idx) => {
    if (!/^\d?$/.test(val)) return
    const next = [...otp]
    next[idx] = val
    setOtp(next)
    if (val && idx < 5) {
      document.getElementById(`operator-otp-${idx + 1}`)?.focus()
    }
  }

  const handleVerify = (e) => {
    e.preventDefault()
    navigate('/user/dashboard') // operator dashboard (reuse for now)
  }

  return (
    <div style={{
      minHeight: '100vh', width: '100%', backgroundColor: '#FFF7EC',
      display: 'flex', flexDirection: 'column',
      fontFamily: "system-ui, 'Segoe UI', Roboto, sans-serif",
    }}>

      <Navbar variant="back" />

      {/* Main — two column */}
      <main className="login-main">
        {/* Left panel */}
        <div className="login-left" style={{ backgroundColor: '#41A465' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '999px',
            padding: '6px 16px', marginBottom: '32px', width: 'fit-content',
          }}>
            <RiBuildingLine size={16} color="#fff" />
            <span style={{ fontSize: '12px', fontWeight: '700', color: '#fff', letterSpacing: '1px', textTransform: 'uppercase' }}>
              Government Operator Portal
            </span>
          </div>

          <h1 style={{ fontSize: 'clamp(32px, 3.5vw, 52px)', fontWeight: '900', color: '#fff', lineHeight: 1.15, marginBottom: '20px' }}>
            Manage Grievances with Efficiency.
          </h1>
          <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.85)', lineHeight: 1.7, marginBottom: '48px', maxWidth: '440px' }}>
            Access the IGMS operator dashboard to assign, track, and resolve citizen complaints efficiently.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              { icon: <MdOutlineShield size={18} />, label: 'Secured Connection', sub: 'End-to-end encrypted access' },
              { icon: <RiBuildingLine size={18} />, label: 'Official Use Only', sub: 'Authorized personnel only' },
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

            {step === 'mobile' ? (
              <>
                <div style={{ marginBottom: '32px' }}>
                  <h2 style={{ fontSize: '28px', fontWeight: '900', color: '#1a1a1a', margin: '0 0 8px' }}>Operator Login</h2>
                  <p style={{ fontSize: '15px', color: '#6b5e52', margin: 0 }}>Enter your registered mobile number to continue</p>
                </div>

                <form onSubmit={handleGetOTP}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', fontWeight: '600', color: '#3a3a3a', marginBottom: '10px' }}>
                    <MdPhone size={15} color="#41A465" /> Mobile Number
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid #e0d5c8', borderRadius: '12px', overflow: 'hidden', backgroundColor: '#faf6f0', marginBottom: '8px' }}>
                    <span style={{ padding: '14px 18px', fontSize: '14px', fontWeight: '600', color: '#555', backgroundColor: '#f0e8dc', borderRight: '1px solid #e0d5c8', whiteSpace: 'nowrap' }}>+91</span>
                    <input type="tel" maxLength={10} value={mobile}
                      onChange={e => setMobile(e.target.value.replace(/\D/g, ''))}
                      placeholder="Enter 10 digit number" required
                      style={{ flex: 1, padding: '14px 18px', fontSize: '14px', color: '#1a1a1a', backgroundColor: 'transparent', border: 'none', outline: 'none' }}
                    />
                  </div>
                  <p style={{ fontSize: '12px', color: '#9e8e80', marginBottom: '24px' }}>We will send a secure 6-digit OTP to this number.</p>
                  <button type="submit" style={{
                    width: '100%', padding: '15px', borderRadius: '12px',
                    backgroundColor: '#41A465', color: '#fff', fontSize: '16px',
                    fontWeight: '700', border: 'none', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    boxShadow: '0 4px 14px rgba(65,164,101,0.3)',
                  }}>
                    Get OTP <MdArrowForward size={20} />
                  </button>
                </form>
              </>
            ) : (
              <>
                <button onClick={() => setStep('mobile')} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', color: '#6b5e52', fontSize: '14px', cursor: 'pointer', marginBottom: '28px', padding: 0 }}>
                  <MdArrowBack size={16} /> Back
                </button>
                <div style={{ marginBottom: '32px' }}>
                  <h2 style={{ fontSize: '28px', fontWeight: '900', color: '#1a1a1a', margin: '0 0 8px' }}>Enter OTP</h2>
                  <p style={{ fontSize: '15px', color: '#6b5e52', margin: 0 }}>
                    OTP sent to <strong>+91 {mobile}</strong>. Valid for 10 minutes.
                  </p>
                </div>

                <form onSubmit={handleVerify}>
                  <div style={{ display: 'flex', gap: '10px', marginBottom: '24px', justifyContent: 'center' }}>
                    {otp.map((d, i) => (
                      <input key={i} id={`operator-otp-${i}`}
                        type="text" inputMode="numeric" maxLength={1} value={d}
                        onChange={e => handleOtpChange(e.target.value, i)}
                        style={{
                          width: '52px', height: '60px', textAlign: 'center',
                          fontSize: '24px', fontWeight: '700', borderRadius: '12px',
                          border: d ? '2px solid #41A465' : '1.5px solid #e0d5c8',
                          backgroundColor: d ? '#edf7f1' : '#faf6f0',
                          color: '#1a1a1a', outline: 'none',
                        }}
                      />
                    ))}
                  </div>
                  <button type="submit" style={{
                    width: '100%', padding: '15px', borderRadius: '12px',
                    backgroundColor: '#41A465', color: '#fff', fontSize: '16px',
                    fontWeight: '700', border: 'none', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    boxShadow: '0 4px 14px rgba(65,164,101,0.3)',
                  }}>
                    Verify & Login <MdArrowForward size={20} />
                  </button>
                  <p style={{ textAlign: 'center', fontSize: '13px', color: '#9e8e80', marginTop: '16px' }}>
                    Didn't receive?{' '}
                    <button type="button" style={{ background: 'none', border: 'none', color: '#41A465', fontWeight: '600', cursor: 'pointer', fontSize: '13px' }}>
                      Resend OTP
                    </button>
                  </p>
                </form>
              </>
            )}

            <p style={{ fontSize: '12px', color: '#9e8e80', marginTop: '28px', lineHeight: 1.6, textAlign: 'center' }}>
              By logging in, you agree to the{' '}
              <a href="#" style={{ color: '#41A465', fontWeight: '600' }}>Official Security Policy</a>
              {' '}and{' '}
              <a href="#" style={{ color: '#41A465', fontWeight: '600' }}>Terms of Service</a>.
              Your IP address is being logged.
            </p>
          </div>
        </div>
      </main>

      <footer style={{ borderTop: '1px solid #e0d5c8', padding: '16px 40px', backgroundColor: '#FFF7EC', textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <MdOutlineVerifiedUser size={14} color="#41A465" />
          <span style={{ fontSize: '12px', color: '#9e8e80' }}>Protected by National Informatics Centre.</span>
          <RiGovernmentLine size={14} color="#151A40" />
          <span style={{ fontSize: '12px', color: '#9e8e80' }}>© {new Date().getFullYear()} IGMS.</span>
        </div>
      </footer>
    </div>
  )
}
