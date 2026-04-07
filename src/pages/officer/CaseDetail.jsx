import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { MdArrowBack, MdSave, MdCameraAlt, MdClose, MdFlipCameraAndroid } from 'react-icons/md'
import { motion } from 'framer-motion'
import OfficerLayout from './OfficerLayout'
import api from '../../utils/secureApi'

const API_BASE = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5001'

const STATUS_STYLES = {
  'Awaiting Review':           { color: '#6b7280', bg: '#f3f4f6' },
  'Complaint Registered':      { color: '#151A40', bg: '#e0f2fe' },
  'Assigned to Field Officer': { color: '#1d4ed8', bg: '#dbeafe' },
  'Inspection Completed':      { color: '#b45309', bg: '#fef3c7' },
  'Work in Progress':          { color: '#7c3aed', bg: '#ede9fe' },
  'Issue Resolved':            { color: '#15803d', bg: '#dcfce7' },
  'Rejected':                  { color: '#dc2626', bg: '#fee2e2' },
}
const DEFAULT_STYLE = { color: '#6b7280', bg: '#f3f4f6' }
const STATUS_OPTIONS = ['Inspection Completed', 'Work in Progress', 'Issue Resolved', 'Rejected']

export default function CaseDetail() {
  const navigate = useNavigate()
  const { id } = useParams()

  const [complaint, setComplaint] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState('Inspection Completed')
  const [note, setNote] = useState('')
  const [photo, setPhoto] = useState(null)
  const [saveMsg, setSaveMsg] = useState('')

  // Camera
  const [showCamera, setShowCamera] = useState(false)
  const [facingMode, setFacingMode] = useState('environment')
  const [camError, setCamError] = useState('')
  const videoRef = useRef(null)
  const streamRef = useRef(null)

  const startCamera = useCallback(async (facing) => {
    setCamError('')
    if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop())
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: facing }, audio: false })
      streamRef.current = stream
      if (videoRef.current) videoRef.current.srcObject = stream
    } catch { setCamError('Camera not available') }
  }, [])

  const stopCamera = useCallback(() => {
    if (streamRef.current) { streamRef.current.getTracks().forEach(t => t.stop()); streamRef.current = null }
  }, [])

  const openCamera = () => { setShowCamera(true); setTimeout(() => startCamera(facingMode), 100) }
  const closeCamera = () => { stopCamera(); setShowCamera(false); setCamError('') }

  const capturePhoto = () => {
    if (!videoRef.current) return
    const canvas = document.createElement('canvas')
    canvas.width = videoRef.current.videoWidth
    canvas.height = videoRef.current.videoHeight
    canvas.getContext('2d').drawImage(videoRef.current, 0, 0)
    canvas.toBlob(blob => {
      if (!blob) return
      setPhoto(new File([blob], `proof_${Date.now()}.jpg`, { type: 'image/jpeg' }))
      closeCamera()
    }, 'image/jpeg', 0.92)
  }

  const fetchComplaint = async () => {
    try {
      const res = await api.get(`/complaints/${id}`)
      setComplaint(res.data)
      const adminStatuses = ['Awaiting Review', 'Complaint Registered', 'Assigned to Field Officer']
      setStatus(adminStatuses.includes(res.data.status) ? 'Inspection Completed' : res.data.status)
    } catch { }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchComplaint() }, [id])

  const handleSave = async () => {
    setSaving(true); setSaveMsg('')
    try {
      await api.patch(`/complaints/${id}/status`, { status, note })
      if (photo) {
        const formData = new FormData()
        formData.append('photos', photo)
        const uploadRes = await fetch(`${API_BASE}/api/complaints/${id}/photos?type=officer`, {
          method: 'POST',
          body: formData,
        })
        if (!uploadRes.ok) {
          const error = await uploadRes.json()
          throw new Error(error.message || 'Photo upload failed')
        }
      }
      setSaveMsg('Updated successfully')
      setNote(''); setPhoto(null)
      closeCamera()
      await fetchComplaint()
      setTimeout(() => setSaveMsg(''), 3000)
    } catch (err) { 
      console.error('Save error:', err)
      setSaveMsg(err.message || 'Failed to update') 
    }
    finally { setSaving(false) }
  }

  if (loading) return <OfficerLayout active="dashboard"><div style={{ padding: '60px', textAlign: 'center', color: '#9ca3af' }}>Loading...</div></OfficerLayout>
  if (!complaint) return <OfficerLayout active="dashboard"><div style={{ padding: '60px', textAlign: 'center', color: '#dc2626' }}>Complaint not found</div></OfficerLayout>

  const ss = STATUS_STYLES[complaint.status] || DEFAULT_STYLE

  return (
    <OfficerLayout active="dashboard">

      <button onClick={() => navigate('/officer/dashboard')} style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '24px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: '600', color: '#6b7280' }}>
        <MdArrowBack size={18} /> Back to task queue
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '24px', alignItems: 'start' }}>

        {/* Left */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            style={{ backgroundColor: '#fff', borderRadius: '14px', padding: '28px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
              <div>
                <span style={{ fontSize: '12px', fontWeight: '700', color: '#151A40', fontFamily: 'monospace' }}>#{complaint.complaintId}</span>
                <h1 style={{ fontSize: '22px', fontWeight: '800', color: '#1a1a1a', margin: '6px 0 0' }}>{complaint.title}</h1>
              </div>
              <span style={{ padding: '5px 14px', borderRadius: '999px', fontSize: '12px', fontWeight: '700', backgroundColor: ss.bg, color: ss.color }}>{complaint.status}</span>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <tbody>
                {[
                  ['Department', complaint.department],
                  ...(complaint.user?.name ? [['Citizen', `${complaint.user.name}${complaint.user.phone ? ' · ' + complaint.user.phone : ''}`]] : []),
                  ...(complaint.location?.city ? [['City', complaint.location.city]] : []),
                  ...(complaint.location?.ward ? [['Ward', complaint.location.ward]] : []),
                  ...(complaint.location?.address ? [['Location', complaint.location.address]] : []),
                  ['Submitted On', new Date(complaint.createdAt).toLocaleString('en-IN')],
                ].map(([label, value]) => (
                  <tr key={label} style={{ borderBottom: '1px solid #f3f4f6' }}>
                    <td style={{ padding: '10px 0', fontSize: '12px', fontWeight: '700', color: '#9ca3af', width: '130px', letterSpacing: '0.4px' }}>{label.toUpperCase()}</td>
                    <td style={{ padding: '10px 0', fontSize: '14px', color: '#1a1a1a', fontWeight: '500', wordBreak: 'break-word' }}>{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
            style={{ backgroundColor: '#fff', borderRadius: '14px', padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
            <h3 style={{ fontSize: '13px', fontWeight: '700', color: '#9ca3af', letterSpacing: '0.5px', margin: '0 0 12px' }}>DESCRIPTION</h3>
            <p style={{ fontSize: '15px', color: '#374151', lineHeight: 1.7, margin: 0 }}>{complaint.description}</p>
          </motion.div>

          {/* Map + Citizen Photos + Officer Photos side by side */}
          {(complaint.location?.lat || complaint.proofFiles?.length > 0 || complaint.officerAttachments?.length > 0 || photo) && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.07 }}
              style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>

              {/* Map */}
              {complaint.location?.lat && complaint.location?.lng && (
                <div style={{ backgroundColor: '#fff', borderRadius: '14px', padding: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', width: 'fit-content' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', gap: '40px' }}>
                    <h3 style={{ fontSize: '13px', fontWeight: '700', color: '#9ca3af', letterSpacing: '0.5px', margin: 0 }}>LOCATION MAP</h3>
                    <a href={`https://www.google.com/maps?q=${complaint.location.lat},${complaint.location.lng}`} target="_blank" rel="noopener noreferrer"
                      style={{ fontSize: '12px', color: '#151A40', fontWeight: '600', textDecoration: 'none', whiteSpace: 'nowrap' }}>
                      Open in Maps ↗
                    </a>
                  </div>
                  <div style={{ width: '280px', borderRadius: '10px', overflow: 'hidden', border: '1px solid #e5e7eb' }}>
                    <iframe title="complaint-location" width="280" height="160" style={{ border: 'none', display: 'block' }}
                      src={`https://maps.google.com/maps?q=${complaint.location.lat},${complaint.location.lng}&z=15&output=embed`} />
                  </div>
                </div>
              )}

              {/* Citizen Documents Card */}
              {complaint.proofFiles?.length > 0 && (
                <div style={{ backgroundColor: '#fff', borderRadius: '14px', padding: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
                  <h3 style={{ fontSize: '13px', fontWeight: '700', color: '#9ca3af', letterSpacing: '0.5px', margin: '0 0 12px' }}>📄 CITIZEN DOCUMENTS</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: '8px', maxWidth: '280px' }}>
                    {complaint.proofFiles.map((f, i) => (
                      <div key={i} onClick={() => window.open(`${API_BASE}${f}`, '_blank')}
                        style={{ borderRadius: '8px', overflow: 'hidden', aspectRatio: '1', cursor: 'pointer', border: '1px solid #e5e7eb', backgroundColor: '#f9fafb' }}>
                        <img src={`${API_BASE}${f}`} alt={`citizen-doc-${i}`}
                          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                          onError={e => { e.target.style.display = 'none' }} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Officer Photos Card - Saved */}
              {complaint.officerAttachments?.length > 0 && (
                <div style={{ backgroundColor: '#fff', borderRadius: '14px', padding: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
                  <h3 style={{ fontSize: '13px', fontWeight: '700', color: '#9ca3af', letterSpacing: '0.5px', margin: '0 0 12px' }}>📸 OFFICER PHOTOS</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: '8px', maxWidth: '280px' }}>
                    {complaint.officerAttachments.map((f, i) => (
                      <div key={i} onClick={() => window.open(`${API_BASE}${f}`, '_blank')}
                        style={{ borderRadius: '8px', overflow: 'hidden', aspectRatio: '1', cursor: 'pointer', border: '1px solid #e5e7eb', backgroundColor: '#f9fafb' }}>
                        <img src={`${API_BASE}${f}`} alt={`officer-photo-${i}`}
                          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                          onError={e => { e.target.style.display = 'none' }} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Officer Photos Card - Preview (Before Save) */}
              {photo && (
                <div style={{ backgroundColor: '#fff', borderRadius: '14px', padding: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', border: '2px solid #fbbf24' }}>
                  <h3 style={{ fontSize: '13px', fontWeight: '700', color: '#b45309', letterSpacing: '0.5px', margin: '0 0 12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    ⏳ PENDING UPLOAD
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: '8px', maxWidth: '280px' }}>
                    <div style={{ borderRadius: '8px', overflow: 'hidden', aspectRatio: '1', border: '2px dashed #fbbf24', backgroundColor: '#fffbeb', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                      <img src={URL.createObjectURL(photo)} alt="pending-upload"
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                      <div style={{ position: 'absolute', top: '4px', right: '4px', backgroundColor: '#fbbf24', color: '#fff', fontSize: '10px', padding: '2px 6px', borderRadius: '4px', fontWeight: '700' }}>
                        NEW
                      </div>
                    </div>
                  </div>
                  <p style={{ fontSize: '11px', color: '#b45309', margin: '8px 0 0', fontWeight: '600' }}>Click "Save Changes" to upload</p>
                </div>
              )}
            </motion.div>
          )}

          {/* Officer Notes Section */}
          {complaint.officerNotes?.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}
              style={{ backgroundColor: '#fff', borderRadius: '14px', padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
              <h3 style={{ fontSize: '13px', fontWeight: '700', color: '#9ca3af', letterSpacing: '0.5px', margin: '0 0 16px' }}>📝 OFFICER/ADMIN NOTES</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {complaint.officerNotes.map((note, i) => (
                  <div key={i} style={{ padding: '12px 14px', borderRadius: '10px', backgroundColor: '#F8F9FA', border: '1px solid #E5E7EB' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <span style={{ fontSize: '12px', fontWeight: '700', color: '#151A40' }}>{note.status}</span>
                      <span style={{ fontSize: '11px', color: '#9ca3af' }}>by {note.uploadedBy}</span>
                    </div>
                    <p style={{ margin: 0, fontSize: '13px', color: '#374151', lineHeight: 1.5 }}>{note.note}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {complaint.statusHistory?.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              style={{ backgroundColor: '#fff', borderRadius: '14px', padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
              <h3 style={{ fontSize: '13px', fontWeight: '700', color: '#9ca3af', letterSpacing: '0.5px', margin: '0 0 16px' }}>ACTIVITY HISTORY</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[...complaint.statusHistory].reverse().map((h, i) => {
                  const hs = STATUS_STYLES[h.status] || DEFAULT_STYLE
                  return (
                    <div key={i} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                      <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: hs.color, marginTop: '5px', flexShrink: 0 }} />
                      <div>
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '13px', fontWeight: '700', color: '#1a1a1a' }}>{h.status}</span>
                          <span style={{ fontSize: '12px', color: '#9ca3af' }}>by {h.changedBy} · {new Date(h.timestamp).toLocaleString('en-IN')}</span>
                        </div>
                        {h.note && <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#6b7280' }}>{h.note}</p>}
                      </div>
                    </div>
                  )
                })}
              </div>
            </motion.div>
          )}
        </div>

        {/* Right — Update panel */}
        <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
          style={{ backgroundColor: '#fff', borderRadius: '14px', padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', position: 'sticky', top: '90px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#1a1a1a', margin: '0 0 20px' }}>⚡ Update Complaint</h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: '700', color: '#6b7280', display: 'block', marginBottom: '6px' }}>STATUS</label>
              <select value={status} onChange={e => setStatus(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1.5px solid #e5e7eb', fontSize: '13px', outline: 'none', cursor: 'pointer' }}>
                {STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: '700', color: '#6b7280', display: 'block', marginBottom: '6px' }}>OFFICER REMARKS</label>
              <textarea value={note} onChange={e => setNote(e.target.value)}
                placeholder="Describe progress, findings, or expected completion..."
                rows={4}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1.5px solid #e5e7eb', fontSize: '13px', outline: 'none', resize: 'none', boxSizing: 'border-box', lineHeight: 1.6 }} />
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: '700', color: '#6b7280', display: 'block', marginBottom: '8px' }}>UPLOAD PHOTO</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button type="button" onClick={openCamera}
                  style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '10px', borderRadius: '8px', border: '1.5px solid #e5e7eb', backgroundColor: '#f9fafb', cursor: 'pointer', fontSize: '13px', fontWeight: '600', color: '#374151' }}>
                  <MdCameraAlt size={16} color="#151A40" /> Take Photo
                </button>
                <label style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '10px', borderRadius: '8px', border: '1.5px solid #e5e7eb', backgroundColor: '#f9fafb', cursor: 'pointer', fontSize: '13px', fontWeight: '600', color: '#374151' }}>
                  📁 Upload
                  <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => setPhoto(e.target.files[0] || null)} />
                </label>
              </div>
              {photo && (
                <div style={{ marginTop: '12px', padding: '12px', borderRadius: '10px', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '12px', color: '#15803d', fontWeight: '600' }}>✓ {photo.name.slice(0, 22)}{photo.name.length > 22 ? '…' : ''}</span>
                    <button type="button" onClick={() => setPhoto(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626', fontSize: '16px' }}>✕</button>
                  </div>
                  <div style={{ width: '100%', height: '120px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #bbf7d0', backgroundColor: '#fff' }}>
                    <img src={URL.createObjectURL(photo)} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                </div>
              )}
            </div>

            {saveMsg && (
              <p style={{ margin: 0, fontSize: '13px', fontWeight: '600', textAlign: 'center', color: saveMsg.includes('success') ? '#15803d' : '#dc2626' }}>
                {saveMsg}
              </p>
            )}

            <button onClick={handleSave} disabled={saving}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px', borderRadius: '10px', border: 'none', backgroundColor: saving ? '#93c5fd' : '#151A40', color: '#fff', fontSize: '14px', fontWeight: '700', cursor: saving ? 'wait' : 'pointer' }}>
              <MdSave size={16} /> {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </motion.div>
      </div>

      {/* Camera Modal */}
      {showCamera && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'transparent', zIndex: 9999, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px', padding: '20px' }}>
          <div style={{ width: '100%', maxWidth: '520px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#1a1a1a', fontWeight: '700', fontSize: '16px' }}>Take Photo</span>
            <button onClick={closeCamera} style={{ background: '#f3f4f6', border: 'none', borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <MdClose size={20} color="#1a1a1a" />
            </button>
          </div>
          <div style={{ width: '100%', maxWidth: '520px', borderRadius: '16px', overflow: 'hidden', border: '1px solid #e5e7eb', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            {camError
              ? <div style={{ padding: '60px', textAlign: 'center', color: '#9ca3af', background: '#f9fafb' }}><p style={{ margin: 0 }}>{camError}</p></div>
              : <video ref={videoRef} autoPlay playsInline muted style={{ width: '100%', display: 'block', maxHeight: '60vh', objectFit: 'cover' }} />
            }
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <button onClick={() => { const next = facingMode === 'environment' ? 'user' : 'environment'; setFacingMode(next); startCamera(next) }}
              style={{ width: '44px', height: '44px', borderRadius: '50%', border: '1px solid #e5e7eb', backgroundColor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
              <MdFlipCameraAndroid size={22} color="#151A40" />
            </button>
            <button onClick={capturePhoto} disabled={!!camError}
              style={{ width: '68px', height: '68px', borderRadius: '50%', border: '4px solid #e5e7eb', backgroundColor: camError ? '#d1d5db' : '#151A40', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: camError ? 'not-allowed' : 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
              <MdCameraAlt size={30} color="#fff" />
            </button>
            <div style={{ width: '44px' }} />
          </div>
        </div>
      )}
    </OfficerLayout>
  )
}
