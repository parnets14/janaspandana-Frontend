import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MdArrowForward, MdCheckCircle } from 'react-icons/md'
import { RiGovernmentLine } from 'react-icons/ri'
import Navbar from '../components/Navbar'

export default function TrackComplaint() {
  const [complaintId, setComplaintId] = useState('')
  const [showResult, setShowResult] = useState(false)
  const navigate = useNavigate()

  const handleTrack = (e) => {
    e.preventDefault()
    setShowResult(true)
  }

  // Mock data
  const complaint = {
    id: 'IGMS-2024-8842',
    title: 'Unscheduled Power Outage - Sector 4',
    category: 'Utility & Power',
    date: 'Oct 24, 2023',
    status: 'In Progress',
    officer: {
      name: 'Rajesh Kumar',
      role: 'Senior Electrical Engineer',
      verified: true,
      avatar: '👨‍💼'
    },
    timeline: [
      {
        status: 'completed',
        title: 'Grievance Submitted',
        date: 'Oct 24, 08:12 AM',
        desc: 'Initial filing received and validated by the automated verification system.'
      },
      {
        status: 'completed',
        title: 'Assigned to Officer',
        date: 'Oct 24, 02:45 PM',
        desc: 'Complaint routed to the Zonal Electrical Engineering Department. Officer "Rajesh Kumar" assigned.'
      },
      {
        status: 'active',
        title: 'Work in Progress',
        date: 'In Focus',
        desc: 'Ground team is currently identifying the fault at Transformer T-42. Expected resolution within 4 hours.',
        image: true
      },
      {
        status: 'pending',
        title: 'Resolved',
        date: '',
        desc: 'Final confirmation and closure once power is restored.'
      }
    ]
  }

  return (
    <div style={{
      minHeight: '100vh', backgroundColor: '#FFF7EC',
      fontFamily: "system-ui, 'Segoe UI', Roboto, sans-serif",
      display: 'flex', flexDirection: 'column',
    }}>

      <Navbar variant="back" />

      <main style={{ flex: 1, width: '100%', maxWidth: '1100px', margin: '0 auto' }} className="page-pad">
        
        {showResult ? (
          <div style={{ paddingTop: '32px' }}>
            
            {/* Complaint Header */}
            <div style={{
              backgroundColor: '#fff', border: '1px solid #ede5d8',
              borderRadius: '16px', padding: 'clamp(20px, 4vw, 28px)', marginBottom: '28px',
            }}>
              <div style={{ display: 'inline-block', padding: '5px 12px', borderRadius: '20px', backgroundColor: '#e3f2fd', color: '#1976d2', fontSize: '12px', fontWeight: '700', marginBottom: '16px' }}>
                • In Progress
              </div>
              <h2 style={{ fontSize: 'clamp(20px, 4vw, 28px)', fontWeight: '900', color: '#1a1a1a', marginBottom: '16px', wordBreak: 'break-word' }}>
                {complaint.title}
              </h2>
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', fontSize: '14px', color: '#6b5e52' }}>
                <span>📂 {complaint.category}</span>
                <span>📅 Filed {complaint.date}</span>
                <span>👤 Assigned to Civil Eng. Dept</span>
              </div>
            </div>

            <div className="case-grid">
              
              {/* Resolution Journey */}
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1a1a1a', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  ✓ Resolution Journey
                </h3>

                <div style={{ position: 'relative' }}>
                  {complaint.timeline.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '16px', marginBottom: idx < complaint.timeline.length - 1 ? '24px' : '0' }}>
                      
                      {/* Timeline icon */}
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{
                          width: '36px', height: '36px', borderRadius: '50%',
                          backgroundColor: item.status === 'completed' ? '#41A465' : item.status === 'active' ? '#1976d2' : '#e0d5c8',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: '#fff', fontSize: '18px', flexShrink: 0,
                        }}>
                          {item.status === 'completed' ? '✓' : item.status === 'active' ? '⚡' : '○'}
                        </div>
                        {idx < complaint.timeline.length - 1 && (
                          <div style={{
                            width: '2px', flex: 1, minHeight: '60px',
                            backgroundColor: item.status === 'completed' ? '#41A465' : '#e0d5c8',
                            marginTop: '4px',
                          }} />
                        )}
                      </div>

                      {/* Timeline content */}
                      <div style={{ flex: 1, paddingBottom: '20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '6px' }}>
                          <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#1a1a1a', margin: 0 }}>
                            {item.title}
                          </h4>
                          {item.status === 'active' && (
                            <span style={{ fontSize: '11px', fontWeight: '700', color: '#1976d2', backgroundColor: '#e3f2fd', padding: '4px 10px', borderRadius: '12px' }}>
                              {item.date}
                            </span>
                          )}
                        </div>
                        {item.date && item.status !== 'active' && (
                          <p style={{ fontSize: '13px', color: '#9e8e80', margin: '0 0 8px' }}>{item.date}</p>
                        )}
                        <p style={{ fontSize: '14px', color: '#6b5e52', lineHeight: 1.6, margin: 0 }}>
                          {item.desc}
                        </p>
                        
                        {item.image && (
                          <div style={{ marginTop: '12px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                            <div style={{
                              width: '140px', height: '100px', borderRadius: '10px',
                              backgroundColor: '#e0d5c8', backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              color: '#fff', fontSize: '12px', fontWeight: '600',
                            }}>
                              Verification Photo
                            </div>
                            <div style={{
                              width: '140px', height: '100px', borderRadius: '10px',
                              border: '2px dashed #e0d5c8', backgroundColor: '#faf6f0',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              color: '#9e8e80', fontSize: '11px', textAlign: 'center', padding: '8px',
                            }}>
                              Verification Photo<br/>Pending
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Sidebar */}
              <div>
                {/* Officer Card */}
                <div style={{
                  backgroundColor: '#fff', border: '1px solid #ede5d8',
                  borderRadius: '16px', padding: '24px', marginBottom: '20px',
                }}>
                  <p style={{ fontSize: '11px', fontWeight: '700', color: '#9e8e80', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '16px' }}>
                    Case Handling Officer
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                    <div style={{
                      width: '48px', height: '48px', borderRadius: '50%',
                      backgroundColor: '#151A40', display: 'flex',
                      alignItems: 'center', justifyContent: 'center',
                      fontSize: '24px',
                    }}>
                      {complaint.officer.avatar}
                    </div>
                    <div>
                      <p style={{ fontSize: '16px', fontWeight: '700', color: '#1a1a1a', margin: 0 }}>
                        {complaint.officer.name}
                      </p>
                      <p style={{ fontSize: '13px', color: '#6b5e52', margin: '2px 0 0' }}>
                        {complaint.officer.role}
                      </p>
                      {complaint.officer.verified && (
                        <span style={{ fontSize: '11px', color: '#41A465', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                          <MdCheckCircle size={14} /> VERIFIED RESPONDER
                        </span>
                      )}
                    </div>
                  </div>
                  <button style={{
                    width: '100%', padding: '12px', borderRadius: '10px',
                    backgroundColor: '#1a1a1a', color: '#fff',
                    border: 'none', fontSize: '14px', fontWeight: '600',
                    cursor: 'pointer', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', gap: '8px',
                  }}>
                    📧 Contact Officer
                  </button>
                  <p style={{ fontSize: '11px', color: '#9e8e80', textAlign: 'center', marginTop: '10px', lineHeight: 1.5 }}>
                    Communication is logged for quality assurance
                  </p>
                </div>

                {/* Area Report */}
                <div style={{
                  backgroundColor: '#fff', border: '1px solid #ede5d8',
                  borderRadius: '16px', padding: '20px',
                }}>
                  <p style={{ fontSize: '14px', fontWeight: '700', color: '#1a1a1a', marginBottom: '12px' }}>
                    📍 Sector 4, Main Grid
                  </p>
                  <div style={{
                    width: '100%', height: '160px', borderRadius: '12px',
                    backgroundColor: '#e0d5c8',
                    backgroundImage: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                    marginBottom: '16px',
                  }} />
                  <div style={{
                    backgroundColor: '#fef0e6', border: '1px solid #f5d5b8',
                    borderRadius: '10px', padding: '12px',
                  }}>
                    <p style={{ fontSize: '13px', fontWeight: '700', color: '#1a1a1a', marginBottom: '6px' }}>
                      Area Report
                    </p>
                    <p style={{ fontSize: '12px', color: '#6b5e52', lineHeight: 1.6, margin: 0 }}>
                      3 other similar issues reported in this grid within the last 24 hours. Emergency teams are on high alert.
                    </p>
                  </div>
                  <div style={{
                    marginTop: '12px', padding: '10px 12px',
                    backgroundColor: '#edf7f1', border: '1px solid #c8e6d5',
                    borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '8px',
                  }}>
                    <span style={{ fontSize: '16px' }}>⚡</span>
                    <p style={{ fontSize: '12px', fontWeight: '600', color: '#41A465', margin: 0 }}>
                      Grid Stability: Critical
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        ) : (
          <div style={{ maxWidth: '680px', margin: '60px auto', padding: '0 16px' }}>
            <h1 style={{ fontSize: 'clamp(32px, 6vw, 42px)', fontWeight: '900', color: '#1a1a1a', marginBottom: '12px' }}>
              Track Resolution
            </h1>
            <p style={{ fontSize: 'clamp(14px, 2vw, 16px)', color: '#6b5e52', lineHeight: 1.7, marginBottom: '40px' }}>
              Enter your unique complaint identifier to view the real-time status of your grievance and any supporting documentation provided by our officers.
            </p>

            <form onSubmit={handleTrack}>
              <label style={{ fontSize: '14px', fontWeight: '600', color: '#3a3a3a', marginBottom: '10px', display: 'block' }}>
                Enter Complaint ID (e.g., #IGMS-2024-8842)
              </label>
              <div className="track-form-container" style={{ display: 'flex', gap: '12px', alignItems: 'stretch', flexWrap: 'wrap' }}>
                <div style={{ flex: '1 1 280px', display: 'flex', alignItems: 'center', border: '1.5px solid #e0d5c8', borderRadius: '12px', overflow: 'hidden', backgroundColor: '#fff', minWidth: '200px' }}>
                  <span style={{ padding: '16px 18px', fontSize: '18px', color: '#9e8e80' }}>📋</span>
                  <input 
                    type="text" value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="Brief summary of the issue"
                    required
                    style={{
                      flex: 1, padding: '16px 18px 16px 0', fontSize: '16px',
                      border: 'none', backgroundColor: 'transparent',
                      outline: 'none', fontWeight: '600', letterSpacing: '0.5px', color: '#1a1a1a',
                    }}
                  />
                </div>
                <button 
                  type="submit"
                  style={{
                    flex: '0 0 auto',
                    padding: '16px 32px', borderRadius: '12px',
                    backgroundColor: '#151A40', border: 'none',
                    color: '#fff', fontSize: '16px', fontWeight: '700',
                    cursor: 'pointer', whiteSpace: 'nowrap',
                    boxShadow: '0 4px 14px rgba(231,83,0,0.3)',
                  }}
                >
                  Track Now
                </button>
              </div>
            </form>
          </div>
        )}

      </main>

      <footer style={{ borderTop: '1px solid #e0d5c8', padding: '20px 32px', backgroundColor: '#FFF7EC' }}>
        <div style={{
          maxWidth: '1100px', margin: '0 auto',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: '8px', flexWrap: 'wrap', fontSize: '12px', color: '#9e8e80',
        }}>
          <RiGovernmentLine size={14} color="#151A40" />
          <span>© 2024 Integrated Grievance Management System, Government of Digital Excellence.</span>
        </div>
      </footer>

    </div>
  )
}
