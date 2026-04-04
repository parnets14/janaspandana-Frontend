import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { MdArrowBack, MdLocationOn, MdMessage, MdRefresh, MdClose } from 'react-icons/md'
import { motion } from 'framer-motion'
import UserLayout from './UserLayout'
import { complaintAPI } from '../../utils/secureApi'

const STATUS_CONFIG = {
  'Complaint Registered':      { color: '#2596be', bg: '#e0f2fe', dot: '#2596be' },
  'Assigned to Field Officer': { color: '#1d4ed8', bg: '#dbeafe', dot: '#1d4ed8' },
  'Inspection Completed':      { color: '#b45309', bg: '#fef3c7', dot: '#b45309' },
  'Work in Progress':          { color: '#7c3aed', bg: '#ede9fe', dot: '#7c3aed' },
  'Issue Resolved':            { color: '#15803d', bg: '#dcfce7', dot: '#15803d' },
  'Rejected':                  { color: '#dc2626', bg: '#fee2e2', dot: '#dc2626' },
}
const DEFAULT_STATUS = { color: '#6b7280', bg: '#f3f4f6', dot: '#9ca3af' }

const TIMELINE_STAGES = [
  'Complaint Registered',
  'Assigned to Field Officer',
  'Inspection Completed',
  'Work in Progress',
  'Issue Resolved',
]

export default function ComplaintDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [complaint, setComplaint] = useState(null)
  const [loading, setLoading] = useState(true)
  const [chatMessage, setChatMessage] = useState('')
  const [showReopen, setShowReopen] = useState(false)
  const [reopenReason, setReopenReason] = useState('')
  const [lightbox, setLightbox] = useState(null)

  const API_BASE = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5001'

  useEffect(() => {
    complaintAPI.getOne(id)
      .then(res => setComplaint(res.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return (
    <UserLayout active="complaints">
      <div style={{ padding: '60px', textAlign: 'center', color: '#9ca3af' }}>Loading...</div>
    </UserLayout>
  )

  if (!complaint) return (
    <UserLayout active="complaints">
      <div style={{ padding: '60px', textAlign: 'center', color: '#dc2626' }}>Complaint not found.</div>
    </UserLayout>
  )

  const statusCfg = STATUS_CONFIG[complaint.status] || DEFAULT_STATUS

  return (
    <UserLayout active="complaints">

      <button onClick={() => navigate('/user/complaints')} style={{
        display: 'flex', alignItems: 'center', gap: '6px',
        padding: '8px 16px', borderRadius: '10px',
        backgroundColor: '#fff', border: '1px solid #e0d5c8',
        color: '#555', fontSize: '14px', fontWeight: '600',
        cursor: 'pointer', marginBottom: '24px',
      }}>
        <MdArrowBack size={18} /> Back to My Complaints
      </button>

      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px', flexWrap: 'wrap' }}>
          <h1 style={{ fontSize: '32px', fontWeight: '900', color: '#1a1a1a', margin: 0 }}>{complaint.title}</h1>
          <span style={{ padding: '6px 16px', borderRadius: '999px', backgroundColor: statusCfg.bg, color: statusCfg.color, fontSize: '12px', fontWeight: '700' }}>
            {complaint.status}
          </span>
        </div>
        <p style={{ fontSize: '14px', fontWeight: '600', color: '#9e8e80', margin: 0 }}>
          #{complaint.complaintId} • {complaint.department} • Filed on {new Date(complaint.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
        </p>
      </div>

      <div className="case-grid">

        {/* Left — Timeline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          <div style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '28px', border: '1px solid #ede5d8' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#1a1a1a', margin: '0 0 24px' }}>Status Timeline</h2>
            <div style={{ position: 'relative', paddingLeft: '32px' }}>
              <div style={{ position: 'absolute', left: '11px', top: '8px', bottom: '8px', width: '2px', backgroundColor: '#e0d5c8' }} />
              {TIMELINE_STAGES.map((stage, i) => {
                const historyEntry = complaint.statusHistory?.find(h => h.status === stage)
                const currentStageIndex = TIMELINE_STAGES.indexOf(complaint.status)
                const isDone = !!historyEntry || i <= currentStageIndex
                // For skipped stages, use the next available history entry's data
                const displayEntry = historyEntry || (isDone
                  ? complaint.statusHistory?.find(h => TIMELINE_STAGES.indexOf(h.status) > i)
                  : null)
                const isLast = i === TIMELINE_STAGES.length - 1
                return (
                  <motion.div key={stage}
                    initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                    style={{ position: 'relative', marginBottom: isLast ? 0 : '24px' }}>
                    <div style={{
                      position: 'absolute', left: '-32px', top: '4px',
                      width: '22px', height: '22px', borderRadius: '50%',
                      backgroundColor: isDone ? '#15803d' : '#e0d5c8',
                      border: '3px solid #fff',
                      boxShadow: '0 0 0 2px ' + (isDone ? '#15803d' : '#e0d5c8'),
                    }} />
                    <p style={{ fontSize: '14px', fontWeight: '700', color: isDone ? '#1a1a1a' : '#9ca3af', margin: '0 0 4px' }}>{stage}</p>
                    {isDone && displayEntry && (
                      <p style={{ fontSize: '12px', color: '#9e8e80', margin: 0 }}>
                        {new Date(displayEntry.timestamp).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        {(displayEntry.assignedTo && displayEntry.assignedTo !== 'Unassigned') ? ` • by ${displayEntry.assignedTo}` : displayEntry.changedBy ? ` • by ${displayEntry.changedBy}` : ''}
                      </p>
                    )}
                    {isDone && historyEntry && historyEntry.note && null}
                  </motion.div>
                )
              })}
            </div>
          </div>

          {/* Chat */}
          <div style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '28px', border: '1px solid #ede5d8' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#1a1a1a', margin: '0 0 16px' }}>Chat with Department</h2>
            <form onSubmit={e => { e.preventDefault(); setChatMessage('') }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', padding: '12px 16px', borderRadius: '12px', backgroundColor: '#faf6f0', border: '1.5px solid #e0d5c8' }}>
                <MdMessage size={18} color="#9e8e80" />
                <input type="text" value={chatMessage} onChange={e => setChatMessage(e.target.value)}
                  placeholder="Type your message or query..."
                  style={{ flex: 1, border: 'none', outline: 'none', fontSize: '14px', color: '#1a1a1a', backgroundColor: 'transparent' }} />
                <motion.button type="submit" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                  style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: '#2596be', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                  <MdMessage size={18} color="#fff" />
                </motion.button>
              </div>
            </form>
          </div>

        </div>

        {/* Right — Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Issue Details */}
          <div style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '24px', border: '1px solid #ede5d8' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1a1a1a', margin: '0 0 16px' }}>Issue Details</h3>
            <p style={{ fontSize: '14px', color: '#6b5e52', margin: '0 0 16px', lineHeight: 1.6 }}>{complaint.description}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                ['Department', complaint.department],
                ['Assigned To', complaint.assignedTo || 'Unassigned'],
              ].map(([label, value]) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '13px', color: '#9e8e80' }}>{label}</span>
                  <span style={{ fontSize: '13px', fontWeight: '600', color: '#1a1a1a' }}>{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Location */}
          {(complaint.location?.lat || complaint.location?.address) && (
            <div style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '24px', border: '1px solid #ede5d8' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1a1a1a', margin: '0 0 16px' }}>Location</h3>
              {complaint.location?.lat && complaint.location?.lng ? (
                <div style={{ borderRadius: '12px', overflow: 'hidden', marginBottom: '12px' }}>
                  <iframe title="map" width="100%" height="180" style={{ display: 'block', border: 'none' }}
                    src={`https://www.google.com/maps?q=${complaint.location.lat},${complaint.location.lng}&z=15&output=embed`} />
                </div>
              ) : (
                <div style={{ height: '160px', borderRadius: '12px', backgroundColor: '#f0f0ee', border: '1px solid #e0d5c8', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                  <p style={{ fontSize: '14px', color: '#9e8e80' }}>Map View</p>
                </div>
              )}
              {complaint.location?.address && (
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <MdLocationOn size={18} color="#2596be" style={{ marginTop: '2px', flexShrink: 0 }} />
                  <p style={{ fontSize: '14px', color: '#6b5e52', margin: 0 }}>{complaint.location.address}</p>
                </div>
              )}
            </div>
          )}

          {/* Attachments */}
          {(complaint.proofFiles?.length > 0 || complaint.statusHistory?.some(h => h.note && h.status !== 'Awaiting Review' && h.status !== 'Pending')) && (
            <div style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '24px', border: '1px solid #ede5d8' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1a1a1a', margin: '0 0 16px' }}>Attachments</h3>

              {/* Notes */}
              {complaint.statusHistory?.filter(h => h.note && h.status !== 'Awaiting Review' && h.status !== 'Pending').map((h, i) => (
                <div key={i} style={{ padding: '10px 14px', borderRadius: '10px', backgroundColor: '#faf6f0', border: '1px solid #ede5d8', marginBottom: '10px' }}>
                  <span style={{ fontSize: '11px', fontWeight: '700', color: '#9e8e80', display: 'block', marginBottom: '4px' }}>{h.status}</span>
                  <p style={{ margin: 0, fontSize: '14px', color: '#374151', lineHeight: 1.5 }}>{h.note}</p>
                </div>
              ))}

              {/* Photos */}
              {complaint.proofFiles?.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))', gap: '10px', marginTop: complaint.statusHistory?.some(h => h.note) ? '12px' : 0 }}>
                  {complaint.proofFiles.map((f, i) => (
                    <div key={i} onClick={() => setLightbox(`${API_BASE}${f}`)}
                      style={{ cursor: 'pointer', borderRadius: '10px', overflow: 'hidden', border: '1px solid #e0d5c8', aspectRatio: '1', backgroundColor: '#f9fafb' }}>
                      <img src={`${API_BASE}${f}`} alt={`attachment-${i + 1}`}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                        onError={e => { e.target.style.display = 'none'; e.target.parentElement.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;font-size:24px">📷</div>' }} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Not Satisfied / Reopen */}
          {complaint.status === 'Issue Resolved' && (
            <div style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '24px', border: '1px solid #ede5d8' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1a1a1a', margin: '0 0 12px' }}>Not Satisfied?</h3>
              {!showReopen ? (
                <motion.button whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }}
                  onClick={() => setShowReopen(true)}
                  style={{ width: '100%', padding: '12px', borderRadius: '10px', backgroundColor: '#fef0e6', border: '1px solid #fcd9c0', color: '#2596be', fontSize: '14px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <MdRefresh size={18} /> Request to Reopen
                </motion.button>
              ) : (
                <form onSubmit={async e => {
                  e.preventDefault()
                  try {
                    await complaintAPI.reopen(complaint._id, reopenReason)
                    setShowReopen(false)
                    setReopenReason('')
                    // Refresh complaint data
                    const res = await complaintAPI.getOne(id)
                    setComplaint(res.data)
                  } catch { /* silent */ }
                }}>
                  <textarea value={reopenReason} onChange={e => setReopenReason(e.target.value)}
                    placeholder="Please explain why you want to reopen this complaint..."
                    rows={3} required
                    style={{ width: '100%', padding: '12px', fontSize: '14px', border: '1.5px solid #e0d5c8', borderRadius: '10px', backgroundColor: '#faf6f0', outline: 'none', fontFamily: 'inherit', resize: 'vertical', marginBottom: '12px', boxSizing: 'border-box' }} />
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button type="button" onClick={() => setShowReopen(false)}
                      style={{ flex: 1, padding: '10px', borderRadius: '8px', backgroundColor: '#f0e8dc', border: '1px solid #e0d5c8', color: '#555', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>
                      Cancel
                    </button>
                    <button type="submit"
                      style={{ flex: 1, padding: '10px', borderRadius: '8px', backgroundColor: '#2596be', border: 'none', color: '#fff', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>
                      Submit Request
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div onClick={() => setLightbox(null)} style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px'
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            position: 'relative', maxWidth: '480px', width: '100%',
            backgroundColor: '#fff', borderRadius: '16px', padding: '16px',
            boxShadow: '0 8px 40px rgba(0,0,0,0.25)'
          }}>
            <button onClick={() => setLightbox(null)} style={{
              position: 'absolute', top: '8px', right: '8px',
              background: '#f3f4f6', border: 'none', borderRadius: '50%',
              width: '28px', height: '28px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <MdClose size={16} color="#374151" />
            </button>
            <img src={lightbox} alt="attachment"
              style={{ width: '100%', borderRadius: '10px', objectFit: 'contain', maxHeight: '60vh', display: 'block' }} />
          </div>
        </div>
      )}

    </UserLayout>
  )
}
