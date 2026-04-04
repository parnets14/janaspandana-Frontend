import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { MdArrowBack, MdLocationOn, MdMessage, MdRefresh } from 'react-icons/md'
import { motion } from 'framer-motion'
import UserLayout from './UserLayout'

export default function ComplaintDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [chatMessage, setChatMessage] = useState('')
  const [showReopen, setShowReopen] = useState(false)
  const [reopenReason, setReopenReason] = useState('')

  const complaint = {
    id: `#IGMS-${id}`,
    title: 'Street Light Malfunction at Sector 4',
    description: 'The street light near my house has not been working for the past week. This is causing safety concerns during night time.',
    sector: 'Public Utilities',
    status: 'Resolved',
    statusColor: '#41A465',
    statusBg: '#edf7f1',
    date: 'Oct 12, 2023',
    assignedTo: 'Officer Ramesh Kumar',
    timeline: [
      { date: 'Oct 12, 2023 10:30 AM', event: 'Complaint Registered', status: 'registered', by: 'System' },
      { date: 'Oct 12, 2023 11:00 AM', event: 'Assigned to Field Officer', status: 'assigned', by: 'Operator' },
      { date: 'Oct 13, 2023 09:15 AM', event: 'Inspection Completed', status: 'inspected', by: 'Officer Ramesh' },
      { date: 'Oct 14, 2023 02:30 PM', event: 'Work in Progress', status: 'progress', by: 'Electrical Dept' },
      { date: 'Oct 15, 2023 04:00 PM', event: 'Issue Resolved', status: 'resolved', by: 'Officer Ramesh' },
    ],
    updates: [
      { date: 'Oct 15, 2023 04:00 PM', dept: 'Electrical Department', message: 'Street light has been repaired and is now functioning properly. Tested and verified.' },
      { date: 'Oct 14, 2023 02:30 PM', dept: 'Public Utilities', message: 'Repair work has started. Expected completion by tomorrow evening.' },
      { date: 'Oct 13, 2023 09:15 AM', dept: 'Field Officer', message: 'Site inspection completed. Faulty bulb and wiring identified. Parts ordered.' },
    ],
    location: { address: 'Sector 4, Block A, Near Park Gate' },
    files: [
      { name: 'street_light_issue.jpg', size: '1.2 MB' },
    ]
  }

  const handleSendMessage = (e) => {
    e.preventDefault()
    alert(`Message sent: ${chatMessage}`)
    setChatMessage('')
  }

  const handleReopen = (e) => {
    e.preventDefault()
    alert(`Reopen request submitted: ${reopenReason}`)
    setShowReopen(false)
    setReopenReason('')
  }

  return (
    <UserLayout active="complaints">
      
      {/* Back Button */}
      <button
        onClick={() => navigate('/user/complaints')}
        style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          padding: '8px 16px', borderRadius: '10px',
          backgroundColor: '#fff', border: '1px solid #e0d5c8',
          color: '#555', fontSize: '14px', fontWeight: '600',
          cursor: 'pointer', marginBottom: '24px',
        }}
      >
        <MdArrowBack size={18} /> Back to My Complaints
      </button>

      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px', flexWrap: 'wrap' }}>
          <h1 style={{ fontSize: '32px', fontWeight: '900', color: '#1a1a1a', margin: 0 }}>
            {complaint.title}
          </h1>
          <span style={{
            padding: '6px 16px', borderRadius: '999px',
            backgroundColor: complaint.statusBg, color: complaint.statusColor,
            fontSize: '12px', fontWeight: '700',
          }}>
            {complaint.status}
          </span>
        </div>
        <p style={{ fontSize: '14px', fontWeight: '600', color: '#9e8e80', margin: 0 }}>
          {complaint.id} • {complaint.sector} • Filed on {complaint.date}
        </p>
      </div>

      <div className="case-grid">
        
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Status Timeline */}
          <div style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '28px', border: '1px solid #ede5d8' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#1a1a1a', margin: '0 0 20px' }}>
              Status Timeline
            </h2>
            <div style={{ position: 'relative', paddingLeft: '32px' }}>
              {/* Vertical line */}
              <div style={{
                position: 'absolute', left: '11px', top: '8px', bottom: '8px',
                width: '2px', backgroundColor: '#e0d5c8',
              }} />
              
              {complaint.timeline.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  style={{ position: 'relative', marginBottom: i < complaint.timeline.length - 1 ? '24px' : 0 }}
                >
                  <div style={{
                    position: 'absolute', left: '-32px', top: '4px',
                    width: '24px', height: '24px', borderRadius: '50%',
                    backgroundColor: item.status === 'resolved' ? '#41A465' : '#2596be',
                    border: '3px solid #fff',
                    boxShadow: '0 0 0 2px #e0d5c8',
                  }} />
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: '700', color: '#1a1a1a', margin: '0 0 4px' }}>
                      {item.event}
                    </p>
                    <p style={{ fontSize: '12px', color: '#9e8e80', margin: 0 }}>
                      {item.date} • by {item.by}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Department Updates */}
          <div style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '28px', border: '1px solid #ede5d8' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#1a1a1a', margin: '0 0 20px' }}>
              Department Updates
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {complaint.updates.map((update, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  style={{
                    padding: '16px', borderRadius: '12px',
                    backgroundColor: '#faf6f0', border: '1px solid #ede5d8',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <p style={{ fontSize: '13px', fontWeight: '700', color: '#41A465', margin: 0 }}>
                      {update.dept}
                    </p>
                    <p style={{ fontSize: '12px', color: '#9e8e80', margin: 0 }}>
                      {update.date}
                    </p>
                  </div>
                  <p style={{ fontSize: '14px', color: '#6b5e52', margin: 0, lineHeight: 1.6 }}>
                    {update.message}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Chat / Remarks */}
          <div style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '28px', border: '1px solid #ede5d8' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#1a1a1a', margin: '0 0 16px' }}>
              Chat with Department
            </h2>
            <form onSubmit={handleSendMessage}>
              <div style={{
                display: 'flex', gap: '12px', alignItems: 'center',
                padding: '12px 16px', borderRadius: '12px',
                backgroundColor: '#faf6f0', border: '1.5px solid #e0d5c8',
              }}>
                <MdMessage size={18} color="#9e8e80" />
                <input
                  type="text"
                  value={chatMessage}
                  onChange={e => setChatMessage(e.target.value)}
                  placeholder="Type your message or query..."
                  style={{
                    flex: 1, border: 'none', outline: 'none',
                    fontSize: '14px', color: '#1a1a1a', backgroundColor: 'transparent',
                  }}
                />
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  style={{
                    width: '36px', height: '36px', borderRadius: '8px',
                    backgroundColor: '#41A465', border: 'none',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                >
                  <MdMessage size={18} color="#fff" />
                </motion.button>
              </div>
            </form>
          </div>

        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Issue Details Card */}
          <div style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '24px', border: '1px solid #ede5d8' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1a1a1a', margin: '0 0 16px' }}>
              Issue Details
            </h3>
            <p style={{ fontSize: '14px', color: '#6b5e52', margin: '0 0 16px', lineHeight: 1.6 }}>
              {complaint.description}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '13px', color: '#9e8e80' }}>Sector</span>
                <span style={{ fontSize: '13px', fontWeight: '600', color: '#1a1a1a' }}>{complaint.sector}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '13px', color: '#9e8e80' }}>Assigned To</span>
                <span style={{ fontSize: '13px', fontWeight: '600', color: '#1a1a1a' }}>{complaint.assignedTo}</span>
              </div>
            </div>
          </div>

          {/* Location */}
          <div style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '24px', border: '1px solid #ede5d8' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1a1a1a', margin: '0 0 16px' }}>
              Location
            </h3>
            <div style={{
              height: '160px', borderRadius: '12px',
              backgroundColor: '#f0f0ee', border: '1px solid #e0d5c8',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: '12px',
            }}>
              <p style={{ fontSize: '14px', color: '#9e8e80' }}>🗺️ Map View</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
              <MdLocationOn size={18} color="#2596be" style={{ marginTop: '2px' }} />
              <p style={{ fontSize: '14px', color: '#6b5e52', margin: 0 }}>
                {complaint.location.address}
              </p>
            </div>
          </div>

          {/* Uploaded Files */}
          <div style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '24px', border: '1px solid #ede5d8' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1a1a1a', margin: '0 0 16px' }}>
              Attachments
            </h3>
            {complaint.files.map((file, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '12px', borderRadius: '10px',
                backgroundColor: '#faf6f0', border: '1px solid #ede5d8',
                marginBottom: i < complaint.files.length - 1 ? '10px' : 0,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '32px', height: '32px', borderRadius: '8px',
                    backgroundColor: '#eff6ff', display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                  }}>
                    📷
                  </div>
                  <div>
                    <p style={{ fontSize: '13px', fontWeight: '600', color: '#1a1a1a', margin: '0 0 2px' }}>
                      {file.name}
                    </p>
                    <p style={{ fontSize: '11px', color: '#9e8e80', margin: 0 }}>{file.size}</p>
                  </div>
                </div>
                <button style={{
                  padding: '5px 12px', borderRadius: '6px',
                  backgroundColor: '#41A465', border: 'none',
                  color: '#fff', fontSize: '11px', fontWeight: '600',
                  cursor: 'pointer',
                }}>
                  View
                </button>
              </div>
            ))}
          </div>

          {/* Reopen Request */}
          {complaint.status === 'Resolved' && (
            <div style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '24px', border: '1px solid #ede5d8' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1a1a1a', margin: '0 0 12px' }}>
                Not Satisfied?
              </h3>
              {!showReopen ? (
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowReopen(true)}
                  style={{
                    width: '100%', padding: '12px', borderRadius: '10px',
                    backgroundColor: '#fef0e6', border: '1px solid #fcd9c0',
                    color: '#2596be', fontSize: '14px', fontWeight: '700',
                    cursor: 'pointer', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', gap: '8px',
                  }}
                >
                  <MdRefresh size={18} /> Request to Reopen
                </motion.button>
              ) : (
                <form onSubmit={handleReopen}>
                  <textarea
                    value={reopenReason}
                    onChange={e => setReopenReason(e.target.value)}
                    placeholder="Please explain why you want to reopen this complaint..."
                    rows={3}
                    required
                    style={{
                      width: '100%', padding: '12px', fontSize: '14px',
                      border: '1.5px solid #e0d5c8', borderRadius: '10px',
                      backgroundColor: '#faf6f0', outline: 'none',
                      fontFamily: 'inherit', resize: 'vertical', marginBottom: '12px',
                    }}
                  />
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      type="button"
                      onClick={() => setShowReopen(false)}
                      style={{
                        flex: 1, padding: '10px', borderRadius: '8px',
                        backgroundColor: '#f0e8dc', border: '1px solid #e0d5c8',
                        color: '#555', fontSize: '13px', fontWeight: '600',
                        cursor: 'pointer',
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      style={{
                        flex: 1, padding: '10px', borderRadius: '8px',
                        backgroundColor: '#2596be', border: 'none',
                        color: '#fff', fontSize: '13px', fontWeight: '600',
                        cursor: 'pointer',
                      }}
                    >
                      Submit Request
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

        </div>

      </div>

    </UserLayout>
  )
}
