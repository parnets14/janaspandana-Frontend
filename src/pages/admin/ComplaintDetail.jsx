import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { MdArrowBack, MdSave } from 'react-icons/md'
import { motion } from 'framer-motion'
import AdminLayout from './AdminLayout'
import { complaintAPI } from '../../utils/secureApi'

const STATUS_STYLES = {
  'Awaiting Review':           { color: '#6b7280', bg: '#f3f4f6' },
  'Complaint Registered':      { color: '#151A40', bg: '#e0f2fe' },
  'Assigned to Field Officer': { color: '#1d4ed8', bg: '#dbeafe' },
  'Inspection Completed':      { color: '#b45309', bg: '#fef3c7' },
  'Work in Progress':          { color: '#7c3aed', bg: '#ede9fe' },
  'Issue Resolved':            { color: '#15803d', bg: '#dcfce7' },
  'Rejected':                  { color: '#dc2626', bg: '#fee2e2' },
}

const PRIORITY_STYLES = {
  'High':   { color: '#dc2626', bg: '#fee2e2' },
  'Medium': { color: '#b45309', bg: '#fef3c7' },
  'Low':    { color: '#15803d', bg: '#dcfce7' },
}

const STATUS_OPTIONS = [
  'Awaiting Review',
  'Complaint Registered',
  'Assigned to Field Officer',
]

export default function AdminComplaintDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [complaint, setComplaint] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState('')
  const [priority, setPriority] = useState('')
  const [assignedTo, setAssignedTo] = useState('')
  const [note, setNote] = useState('')
  const [saveMsg, setSaveMsg] = useState('')

  useEffect(() => {
    complaintAPI.getOne(id)
      .then(res => {
        setComplaint(res.data)
        setStatus(res.data.status)
        setPriority(res.data.priority)
        setAssignedTo(res.data.assignedTo)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [id])

  const handleSave = async () => {
    setSaving(true)
    setSaveMsg('')
    try {
      const res = await complaintAPI.updateStatus(id, { status, priority, assignedTo, note })
      setComplaint(res.data)
      setNote('')
      setSaveMsg('Updated successfully')
      setTimeout(() => setSaveMsg(''), 3000)
    } catch {
      setSaveMsg('Failed to update')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return (
    <AdminLayout active="complaints">
      <div style={{ padding: '60px', textAlign: 'center', color: '#9ca3af' }}>Loading...</div>
    </AdminLayout>
  )

  if (!complaint) return (
    <AdminLayout active="complaints">
      <div style={{ padding: '60px', textAlign: 'center', color: '#dc2626' }}>Complaint not found</div>
    </AdminLayout>
  )

  const statusStyle = STATUS_STYLES[complaint.status] || { color: '#6b7280', bg: '#f3f4f6' }
  const priorityStyle = PRIORITY_STYLES[complaint.priority] || PRIORITY_STYLES['Medium']

  return (
    <AdminLayout active="complaints">
      {/* Back */}
      <button onClick={() => navigate('/admin/complaints')} style={{
        display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '24px',
        background: 'none', border: 'none', cursor: 'pointer',
        fontSize: '14px', fontWeight: '600', color: '#6b7280'
      }}>
        <MdArrowBack size={18} /> Back to Complaints
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '24px', alignItems: 'start' }}>

        {/* Left — Complaint Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Header card */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            style={{ backgroundColor: '#fff', borderRadius: '14px', padding: '28px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
              <div>
                <span style={{ fontSize: '12px', fontWeight: '700', color: '#151A40', fontFamily: 'monospace' }}>#{complaint.complaintId}</span>
                <h1 style={{ fontSize: '22px', fontWeight: '800', color: '#1a1a1a', margin: '6px 0 0' }}>{complaint.title}</h1>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <span style={{ padding: '5px 14px', borderRadius: '999px', fontSize: '12px', fontWeight: '700', backgroundColor: priorityStyle.bg, color: priorityStyle.color }}>
                  {complaint.priority}
                </span>
                <span style={{ padding: '5px 14px', borderRadius: '999px', fontSize: '12px', fontWeight: '700', backgroundColor: statusStyle.bg, color: statusStyle.color }}>
                  {complaint.status}
                </span>
              </div>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <tbody>
                {[
                  ['Department', complaint.department],
                  ['Submitted By', `${complaint.user?.name || '—'} (${complaint.user?.phone || '—'})`],
                  ...(complaint.location?.city ? [['City', complaint.location.city]] : []),
                  ...(complaint.location?.ward ? [['Ward', complaint.location.ward]] : []),
                  ['Location', complaint.location?.address || '—'],
                  ...(complaint.assignedTo && complaint.assignedTo !== 'Unassigned' ? [['Assigned To', complaint.assignedTo]] : []),
                  ['Submitted On', new Date(complaint.createdAt).toLocaleString('en-IN')],
                ].map(([label, value]) => (
                  <tr key={label} style={{ borderBottom: '1px solid #f3f4f6' }}>
                    <td style={{ padding: '10px 0', fontSize: '12px', fontWeight: '700', color: '#9ca3af', width: '140px', letterSpacing: '0.4px' }}>
                      {label.toUpperCase()}
                    </td>
                    <td style={{ padding: '10px 0', fontSize: '14px', color: '#1a1a1a', fontWeight: '500' }}>
                      {value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>

          {/* Description */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
            style={{ backgroundColor: '#fff', borderRadius: '14px', padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#6b7280', letterSpacing: '0.5px', margin: '0 0 12px' }}>DESCRIPTION</h3>
            <p style={{ fontSize: '15px', color: '#374151', lineHeight: 1.7, margin: 0 }}>{complaint.description}</p>
          </motion.div>

          {/* Status History */}
          {complaint.statusHistory?.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              style={{ backgroundColor: '#fff', borderRadius: '14px', padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
              <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#6b7280', letterSpacing: '0.5px', margin: '0 0 16px' }}>ACTIVITY HISTORY</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[...complaint.statusHistory].reverse().map((h, i) => {
                  const s = STATUS_STYLES[h.status] || { color: '#6b7280', bg: '#f3f4f6' }
                  return (
                    <div key={i} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                      <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: s.color, marginTop: '5px', flexShrink: 0 }} />
                      <div>
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '13px', fontWeight: '700', color: '#1a1a1a' }}>{h.status}</span>
                          <span style={{ fontSize: '12px', color: '#9ca3af' }}>by {h.changedBy}</span>
                          <span style={{ fontSize: '11px', color: '#d1d5db' }}>{new Date(h.timestamp).toLocaleString('en-IN')}</span>
                        </div>
                        {h.note && <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#6b7280' }}>{h.note}</p>}
                      </div>
                    </div>
                  )
                })}
              </div>
            </motion.div>
          )}

          {/* Citizen Documents Card */}
          {complaint.proofFiles?.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}
              style={{ backgroundColor: '#fff', borderRadius: '14px', padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
              <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#6b7280', letterSpacing: '0.5px', margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '16px' }}>📄</span> CITIZEN DOCUMENTS
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '12px' }}>
                {complaint.proofFiles.map((f, i) => (
                  <a key={i} href={`${import.meta.env.VITE_API_URL?.replace('/api', '') || 'https://janoni.in'}${f}`} target="_blank" rel="noopener noreferrer"
                    style={{ borderRadius: '10px', overflow: 'hidden', aspectRatio: '1', border: '1px solid #e5e7eb', backgroundColor: '#f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
                    <img src={`${import.meta.env.VITE_API_URL?.replace('/api', '') || 'https://janoni.in'}${f}`} alt={`doc-${i}`}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                      onError={e => { e.target.style.display = 'none' }} />
                  </a>
                ))}
              </div>
            </motion.div>
          )}

          {/* Officer Photos Card */}
          {complaint.officerAttachments?.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.14 }}
              style={{ backgroundColor: '#fff', borderRadius: '14px', padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
              <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#6b7280', letterSpacing: '0.5px', margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '16px' }}>📸</span> OFFICER PHOTOS
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '12px' }}>
                {complaint.officerAttachments.map((f, i) => (
                  <a key={i} href={`${import.meta.env.VITE_API_URL?.replace('/api', '') || 'https://janoni.in'}${f}`} target="_blank" rel="noopener noreferrer"
                    style={{ borderRadius: '10px', overflow: 'hidden', aspectRatio: '1', border: '1px solid #e5e7eb', backgroundColor: '#f9fafb', display: 'block', textDecoration: 'none' }}>
                    <img src={`${import.meta.env.VITE_API_URL?.replace('/api', '') || 'https://janoni.in'}${f}`} alt={`officer-photo-${i}`}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                      onError={e => { e.target.style.display = 'none' }} />
                  </a>
                ))}
              </div>
            </motion.div>
          )}

          {/* Admin Photos Card */}
          {complaint.adminAttachments?.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
              style={{ backgroundColor: '#fff', borderRadius: '14px', padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
              <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#6b7280', letterSpacing: '0.5px', margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '16px' }}>👨‍💼</span> ADMIN PHOTOS
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '12px' }}>
                {complaint.adminAttachments.map((f, i) => (
                  <a key={i} href={`${import.meta.env.VITE_API_URL?.replace('/api', '') || 'https://janoni.in'}${f}`} target="_blank" rel="noopener noreferrer"
                    style={{ borderRadius: '10px', overflow: 'hidden', aspectRatio: '1', border: '1px solid #e5e7eb', backgroundColor: '#f9fafb', display: 'block', textDecoration: 'none' }}>
                    <img src={`${import.meta.env.VITE_API_URL?.replace('/api', '') || 'https://janoni.in'}${f}`} alt={`admin-photo-${i}`}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                      onError={e => { e.target.style.display = 'none' }} />
                  </a>
                ))}
              </div>
            </motion.div>
          )}

          {/* Officer/Admin Notes Card */}
          {complaint.officerNotes?.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }}
              style={{ backgroundColor: '#fff', borderRadius: '14px', padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
              <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#6b7280', letterSpacing: '0.5px', margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '16px' }}>📝</span> OFFICER/ADMIN NOTES
              </h3>
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
        </div>

        {/* Right — Update Panel */}
        <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
          style={{ backgroundColor: '#fff', borderRadius: '14px', padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', position: 'sticky', top: '90px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#1a1a1a', margin: '0 0 20px' }}>Update Complaint</h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: '700', color: '#6b7280', display: 'block', marginBottom: '6px' }}>STATUS</label>
              <select value={status} onChange={e => setStatus(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1.5px solid #e5e7eb', fontSize: '13px', outline: 'none' }}>
                {STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: '700', color: '#6b7280', display: 'block', marginBottom: '6px' }}>PRIORITY</label>
              <select value={priority} onChange={e => setPriority(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1.5px solid #e5e7eb', fontSize: '13px', outline: 'none' }}>
                {['Low', 'Medium', 'High'].map(p => <option key={p}>{p}</option>)}
              </select>
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: '700', color: '#6b7280', display: 'block', marginBottom: '6px' }}>ASSIGNED TO</label>
              <input value={assignedTo} onChange={e => setAssignedTo(e.target.value)}
                placeholder="Officer name or department"
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1.5px solid #e5e7eb', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} />
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: '700', color: '#6b7280', display: 'block', marginBottom: '6px' }}>NOTE</label>
              <textarea value={note} onChange={e => setNote(e.target.value)}
                placeholder="Add a note about this update..."
                rows={3}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1.5px solid #e5e7eb', fontSize: '13px', outline: 'none', resize: 'none', boxSizing: 'border-box' }} />
            </div>

            {saveMsg && (
              <p style={{ margin: 0, fontSize: '13px', fontWeight: '600', color: saveMsg.includes('success') ? '#15803d' : '#dc2626', textAlign: 'center' }}>
                {saveMsg}
              </p>
            )}

            <button onClick={handleSave} disabled={saving}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                padding: '12px', borderRadius: '10px', border: 'none',
                backgroundColor: saving ? '#93c5fd' : '#151A40', color: '#fff',
                fontSize: '14px', fontWeight: '700', cursor: saving ? 'wait' : 'pointer'
              }}>
              <MdSave size={16} /> {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </motion.div>
      </div>
    </AdminLayout>
  )
}
