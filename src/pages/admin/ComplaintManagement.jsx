import { useState, useEffect, useCallback, useRef } from 'react'
import { MdSearch, MdFilterList, MdRemoveRedEye, MdRefresh, MdClose, MdSave, MdCameraAlt, MdUpload, MdFlipCameraAndroid, MdDelete } from 'react-icons/md'
import { motion, AnimatePresence } from 'framer-motion'
import AdminLayout from './AdminLayout'
import { complaintAPI } from '../../utils/secureApi'

const STATUS_STYLES = {
  'Awaiting Review':           { color: '#6b7280', bg: '#f3f4f6' },
  'Complaint Registered':      { color: '#151A40', bg: '#e0f2fe' },
  'Assigned to Field Officer': { color: '#1d4ed8', bg: '#dbeafe' },
 
  // legacy fallbacks
  'Pending':     { color: '#6b7280', bg: '#f3f4f6' },
  'In Progress': { color: '#7c3aed', bg: '#ede9fe' },
  'Resolved':    { color: '#15803d', bg: '#dcfce7' },
  'Escalated':   { color: '#dc2626', bg: '#fee2e2' },
  'Rejected':    { color: '#dc2626', bg: '#fee2e2' },
}
const PRIORITY_STYLES = {
  'High':   { color: '#dc2626', bg: '#fee2e2' },
  'Medium': { color: '#b45309', bg: '#fef3c7' },
  'Low':    { color: '#15803d', bg: '#dcfce7' },
}
const statuses = ['All Status', 'Awaiting Review', 'Complaint Registered', 'Assigned to Field Officer']

const DEFAULT_STATUS_STYLE = { color: '#6b7280', bg: '#f3f4f6' }
const DEFAULT_PRIORITY_STYLE = { color: '#b45309', bg: '#fef3c7' }

export default function ComplaintManagement() {
  const [complaints, setComplaints] = useState([])
  const [stats, setStats] = useState({ total: 0, pending: 0, inProgress: 0, resolved: 0 })
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState('')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All Status')
  const [dateFilter, setDateFilter] = useState('')

  // Modal state
  const [selected, setSelected] = useState(null)
  const [modalLoading, setModalLoading] = useState(false)
  const [editStatus, setEditStatus] = useState('')
  const [editPriority, setEditPriority] = useState('')
  const [editAssigned, setEditAssigned] = useState('')
  const [editNote, setEditNote] = useState('')
  const [editPhotos, setEditPhotos] = useState([])
  const [officers, setOfficers] = useState([])

  useEffect(() => {
    fetch((import.meta.env.VITE_API_URL || 'https://janoni.in/api') + '/admin/officers')
      .then(r => r.json())
      .then(res => { if (res.success) setOfficers(res.data) })
      .catch(() => {})
  }, [])
  const [showAdminCamera, setShowAdminCamera] = useState(false)
  const [adminFacing, setAdminFacing] = useState('environment')
  const [adminCamError, setAdminCamError] = useState('')
  const adminVideoRef = useRef(null)
  const adminStreamRef = useRef(null)
  const photoInputRef = useRef(null)

  const startAdminCamera = async (facing = adminFacing) => {
    setAdminCamError('')
    if (adminStreamRef.current) adminStreamRef.current.getTracks().forEach(t => t.stop())
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: facing }, audio: false })
      adminStreamRef.current = stream
      if (adminVideoRef.current) adminVideoRef.current.srcObject = stream
    } catch { setAdminCamError('Camera not available') }
  }

  const stopAdminCamera = () => {
    if (adminStreamRef.current) { adminStreamRef.current.getTracks().forEach(t => t.stop()); adminStreamRef.current = null }
  }

  const openAdminCamera = () => { setShowAdminCamera(true); setTimeout(() => startAdminCamera(adminFacing), 100) }
  const closeAdminCamera = () => { stopAdminCamera(); setShowAdminCamera(false); setAdminCamError('') }

  const captureAdminPhoto = () => {
    if (!adminVideoRef.current) return
    const canvas = document.createElement('canvas')
    canvas.width = adminVideoRef.current.videoWidth
    canvas.height = adminVideoRef.current.videoHeight
    canvas.getContext('2d').drawImage(adminVideoRef.current, 0, 0)
    canvas.toBlob(blob => {
      if (!blob) return
      const file = new File([blob], `admin_photo_${Date.now()}.jpg`, { type: 'image/jpeg' })
      setEditPhotos(p => [...p, file])
      closeAdminCamera()
    }, 'image/jpeg', 0.92)
  }
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState('')

  const fetchComplaints = useCallback(async () => {
    setLoading(true)
    setFetchError('')
    try {
      const params = {}
      if (statusFilter !== 'All Status') params.status = statusFilter
      if (dateFilter) params.date = dateFilter
      if (search) params.search = search
      const res = await complaintAPI.getAll(params)
      setComplaints(res.data || [])
      setStats(res.stats || { total: 0, pending: 0, inProgress: 0, resolved: 0 })
    } catch (err) {
      console.error('Failed to fetch complaints:', err)
      setFetchError(err.message || 'Failed to load complaints')
      setComplaints([])
    }
    finally { setLoading(false) }
  }, [statusFilter, dateFilter, search])

  useEffect(() => {
    const t = setTimeout(fetchComplaints, 300)
    return () => clearTimeout(t)
  }, [fetchComplaints])

  const openModal = async (id) => {
    setModalLoading(true)
    setSelected(null)
    setSaveMsg('')
    try {
      const res = await complaintAPI.getOne(id)
      setSelected(res.data)
      setEditStatus('Complaint Registered')
      setEditPriority(res.data.priority)
      setEditAssigned(res.data.assignedTo)
      setEditNote('')
    } catch { /* silent */ }
    finally { setModalLoading(false) }
  }

  const closeModal = () => { setSelected(null); setSaveMsg(''); setEditPhotos([]); stopAdminCamera(); setShowAdminCamera(false) }

  const [acceptedComplaint, setAcceptedComplaint] = useState(null)

  const [deleteConfirm, setDeleteConfirm] = useState(null)

  const handleDelete = async (id) => {
    try {
      await complaintAPI.deleteOne(id)
      setDeleteConfirm(null)
      fetchComplaints()
    } catch { /* silent */ }
  }

  const handleQuickAction = async (id, action, complaint) => {
    try {
      await complaintAPI.updateStatus(id, {
        status: action === 'accept' ? 'Complaint Registered' : 'Rejected',
        note: action === 'accept' ? 'Complaint accepted and registered by admin' : 'Complaint rejected by admin',
        isAdmin: true
      })
      if (action === 'accept') setAcceptedComplaint(complaint)
      fetchComplaints()
    } catch { /* silent */ }
  }

  const handleSave = async () => {
    if (!selected) return
    setSaving(true); setSaveMsg('')
    try {
      const res = await complaintAPI.updateStatus(selected._id, {
        status: editStatus, priority: editPriority,
        assignedTo: editAssigned, note: editNote, isAdmin: true
      })
      // Upload photos if any
      if (editPhotos.length > 0) {
        await complaintAPI.uploadPhotos(selected._id, editPhotos)
      }
      const updated = await complaintAPI.getOne(selected._id)
      setSelected(updated.data)
      setEditNote('')
      setEditPhotos([])
      setSaveMsg('Updated successfully')
      fetchComplaints()
      setTimeout(() => {
        setSaveMsg('')
        closeModal()
      }, 800)
    } catch { setSaveMsg('Failed to update') }
    finally { setSaving(false) }
  }

  return (
    <AdminLayout active="complaints">

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#1a1a1a', margin: '0 0 6px' }}>All Complaints</h1>
          <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>Manage and track all citizen grievances</p>
        </div>
        <button onClick={fetchComplaints} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 18px', borderRadius: '10px', border: '1px solid #e5e7eb', backgroundColor: '#fff', fontSize: '13px', fontWeight: '600', cursor: 'pointer', color: '#374151' }}>
          <MdRefresh size={16} /> Refresh
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px', marginBottom: '28px' }}>
        {[
          { label: 'Total', value: stats.total, color: '#151A40', border: '#151A40' },
          { label: 'Awaiting Review', value: stats.pending, color: '#6b7280', border: '#9ca3af' },
          { label: 'In Progress', value: stats.inProgress, color: '#7c3aed', border: '#8b5cf6' },
          { label: 'Resolved', value: stats.resolved, color: '#15803d', border: '#22c55e' },
        ].map(s => (
          <div key={s.label} style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', borderLeft: `4px solid ${s.border}` }}>
            <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '6px' }}>{s.label}</div>
            <div style={{ fontSize: '28px', fontWeight: '800', color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '20px', marginBottom: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <MdFilterList size={18} color="#151A40" />
          <span style={{ fontSize: '15px', fontWeight: '700', color: '#1a1a1a' }}>Filters</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginBottom: '12px' }}>
          <div>
            <label style={{ fontSize: '12px', fontWeight: '600', color: '#6b7280', display: 'block', marginBottom: '6px' }}>STATUS</label>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
              style={{ width: '100%', padding: '9px 12px', fontSize: '13px', border: '1px solid #e5e7eb', borderRadius: '8px', outline: 'none', backgroundColor: '#fff' }}>
              {statuses.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize: '12px', fontWeight: '600', color: '#6b7280', display: 'block', marginBottom: '6px' }}>DATE</label>
            <input type="date" value={dateFilter} onChange={e => setDateFilter(e.target.value)}
              style={{ width: '100%', padding: '9px 12px', fontSize: '13px', border: '1px solid #e5e7eb', borderRadius: '8px', outline: 'none', boxSizing: 'border-box' }} />
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', borderRadius: '8px', backgroundColor: '#f9fafb', border: '1px solid #e5e7eb' }}>
          <MdSearch size={18} color="#9ca3af" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by Complaint ID or Title..."
            style={{ flex: 1, border: 'none', outline: 'none', fontSize: '13px', color: '#1a1a1a', backgroundColor: 'transparent' }} />
        </div>
      </div>

      {/* Table */}
      <div style={{ backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '60px', textAlign: 'center', color: '#9ca3af' }}>Loading...</div>
        ) : fetchError ? (
          <div style={{ padding: '60px', textAlign: 'center' }}>
            <p style={{ color: '#dc2626', fontSize: '14px', fontWeight: '600', margin: '0 0 12px' }}>{fetchError}</p>
            <button onClick={fetchComplaints} style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid #e5e7eb', backgroundColor: '#fff', fontSize: '13px', fontWeight: '600', cursor: 'pointer', color: '#374151' }}>
              Try Again
            </button>
          </div>
        ) : complaints.length === 0 ? (
          <div style={{ padding: '60px', textAlign: 'center', color: '#6b7280' }}>No complaints found</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '900px' }}>
              <thead>
                <tr style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                  {['Complaint ID', 'Title', 'Citizen', 'Department', 'Location', 'Status', 'Date', 'Action'].map(h => (
                    <th key={h} style={{ padding: '13px 16px', textAlign: 'left', fontSize: '11px', fontWeight: '700', color: '#6b7280', letterSpacing: '0.6px', whiteSpace: 'nowrap' }}>
                      {h.toUpperCase()}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {complaints.map((c, i) => {
                  const ss = STATUS_STYLES[c.adminStatus || c.status] || DEFAULT_STATUS_STYLE
                  const ps = PRIORITY_STYLES[c.priority] || DEFAULT_PRIORITY_STYLE
                  return (
                    <motion.tr key={c._id}
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                      style={{ borderBottom: '1px solid #f3f4f6', transition: 'background 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = '#fafafa'}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                      <td style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>
                        <span style={{ fontSize: '12px', fontWeight: '700', color: '#151A40', fontFamily: 'monospace' }}>#{c.complaintId}</span>
                      </td>
                      <td style={{ padding: '14px 16px', maxWidth: '200px' }}>
                        <p style={{ margin: 0, fontSize: '13px', fontWeight: '600', color: '#1a1a1a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.title}</p>
                        <p style={{ margin: '3px 0 0', fontSize: '11px', color: '#9ca3af', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '180px' }}>{c.description}</p>
                      </td>
                      <td style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>
                        <p style={{ margin: 0, fontSize: '13px', fontWeight: '600', color: '#1a1a1a' }}>{c.user?.name || '—'}</p>
                        <p style={{ margin: '2px 0 0', fontSize: '11px', color: '#9ca3af' }}>{c.user?.phone ? '+91 ' + c.user.phone : ''}</p>
                      </td>
                      <td style={{ padding: '14px 16px', whiteSpace: 'nowrap', fontSize: '13px', color: '#374151', fontWeight: '500' }}>{c.department}</td>
                      <td style={{ padding: '14px 16px', maxWidth: '160px' }}>
                        <span style={{ fontSize: '12px', color: '#6b7280', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}>
                          {[c.location?.city, c.location?.ward].filter(Boolean).join(' · ') || c.location?.address || '—'}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>
                        <span style={{ padding: '4px 12px', borderRadius: '999px', fontSize: '11px', fontWeight: '700', backgroundColor: ss.bg, color: ss.color }}>
                          {c.adminStatus || (c.status === 'Pending' ? 'Awaiting Review' : c.status)}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px', whiteSpace: 'nowrap', fontSize: '12px', color: '#6b7280' }}>
                        {new Date(c.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>
                      <td style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>
                        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                          {(c.status === 'Awaiting Review' || c.status === 'Pending') && (
                            <>
                              <button onClick={() => handleQuickAction(c._id, 'accept', c)}
                                style={{ padding: '5px 12px', borderRadius: '7px', border: 'none', backgroundColor: '#dcfce7', color: '#15803d', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}>
                                Accept
                              </button>
                              <button onClick={() => handleQuickAction(c._id, 'reject', c)}
                                style={{ padding: '5px 12px', borderRadius: '7px', border: 'none', backgroundColor: '#fee2e2', color: '#dc2626', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}>
                                Reject
                              </button>
                            </>
                          )}
                          <button onClick={() => openModal(c._id)}
                            style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '6px 12px', borderRadius: '8px', border: '1px solid #e5e7eb', backgroundColor: '#f9fafb', fontSize: '12px', fontWeight: '600', color: '#151A40', cursor: 'pointer' }}>
                            <MdRemoveRedEye size={14} /> View
                          </button>
                          <button onClick={() => setDeleteConfirm(c)}
                            style={{ padding: '6px 10px', borderRadius: '8px', border: '1px solid #fee2e2', backgroundColor: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                            <MdDelete size={15} color="#dc2626" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
        {!loading && complaints.length > 0 && (
          <div style={{ padding: '14px 20px', borderTop: '1px solid #f3f4f6', fontSize: '13px', color: '#6b7280', textAlign: 'right' }}>
            {complaints.length} complaint{complaints.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {(modalLoading || selected) && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={closeModal}
              style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.45)', zIndex: 200 }} />

            <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }}
              style={{
                position: 'fixed', inset: 0, margin: 'auto',
                width: '100%', maxWidth: '780px', height: 'fit-content',
                maxHeight: '90vh', overflowY: 'auto',
                backgroundColor: '#fff', borderRadius: '20px',
                boxShadow: '0 24px 64px rgba(0,0,0,0.2)', zIndex: 201,
              }}>

              {modalLoading ? (
                <div style={{ padding: '80px', textAlign: 'center', color: '#9ca3af' }}>Loading...</div>
              ) : selected && (
                <>
                  {/* Modal Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '24px 28px', borderBottom: '1px solid #f3f4f6' }}>
                    <div>
                      <span style={{ fontSize: '12px', fontWeight: '700', color: '#151A40', fontFamily: 'monospace' }}>#{selected.complaintId}</span>
                      <h2 style={{ margin: '6px 0 0', fontSize: '20px', fontWeight: '800', color: '#1a1a1a' }}>{selected.title}</h2>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ padding: '4px 12px', borderRadius: '999px', fontSize: '11px', fontWeight: '700', backgroundColor: (STATUS_STYLES[selected.status] || DEFAULT_STATUS_STYLE).bg, color: (STATUS_STYLES[selected.status] || DEFAULT_STATUS_STYLE).color }}>{selected.status}</span>
                      <button onClick={closeModal} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', display: 'flex', padding: '4px' }}>
                        <MdClose size={22} />
                      </button>
                    </div>
                  </div>

                  <div style={{ padding: '24px 28px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>

                    {/* Left col — complaint info */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                      {/* Details table */}
                      <div>
                        <p style={{ margin: '0 0 12px', fontSize: '11px', fontWeight: '700', color: '#9ca3af', letterSpacing: '0.6px' }}>COMPLAINT DETAILS</p>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                          <tbody>
                            {[
                              ['Department', selected.department],
                              ...(selected.location?.city ? [['City', selected.location.city]] : []),
                              ...(selected.location?.ward ? [['Ward', selected.location.ward]] : []),
                              ['Location', selected.location?.address || '—'],
                              ...(selected.assignedTo && selected.assignedTo !== 'Unassigned' ? [['Assigned To', selected.assignedTo]] : []),
                              ['Submitted On', new Date(selected.createdAt).toLocaleString('en-IN')],
                            ].map(([label, value]) => (
                              <tr key={label} style={{ borderBottom: '1px solid #f3f4f6' }}>
                                <td style={{ padding: '9px 0', fontSize: '11px', fontWeight: '700', color: '#9ca3af', width: '110px', letterSpacing: '0.3px' }}>{label.toUpperCase()}</td>
                                <td style={{ padding: '9px 0', fontSize: '13px', color: '#1a1a1a', fontWeight: '500', wordBreak: 'break-word' }}>{value}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Description */}
                      <div>
                        <p style={{ margin: '0 0 8px', fontSize: '11px', fontWeight: '700', color: '#9ca3af', letterSpacing: '0.6px' }}>DESCRIPTION</p>
                        <p style={{ margin: 0, fontSize: '14px', color: '#374151', lineHeight: 1.7, backgroundColor: '#f9fafb', padding: '14px', borderRadius: '10px' }}>
                          {selected.description}
                        </p>
                      </div>

                      {/* Citizen Uploads */}
                      {selected.proofFiles?.length > 0 && (
                        <div>
                          <p style={{ margin: '0 0 10px', fontSize: '11px', fontWeight: '700', color: '#9ca3af', letterSpacing: '0.6px' }}>CITIZEN UPLOADS</p>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: '8px' }}>
                            {selected.proofFiles.map((f, i) => (
                              <div key={i} onClick={() => window.open(`${import.meta.env.VITE_API_URL?.replace('/api','')||'https://janoni.in'}${f}`, '_blank')}
                                style={{ cursor: 'pointer', borderRadius: '8px', overflow: 'hidden', border: '1px solid #e5e7eb', aspectRatio: '1', backgroundColor: '#f9fafb' }}>
                                <img src={`${import.meta.env.VITE_API_URL?.replace('/api','')||'https://janoni.in'}${f}`} alt={`proof-${i}`}
                                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                                  onError={e => { e.target.style.display = 'none' }} />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Status notes */}
                      {selected.statusHistory?.some(h => h.note && h.status !== 'Awaiting Review') && (
                        <div>
                          <p style={{ margin: '0 0 10px', fontSize: '11px', fontWeight: '700', color: '#9ca3af', letterSpacing: '0.6px' }}>NOTES</p>
                          {selected.statusHistory.filter(h => h.note && h.status !== 'Awaiting Review').map((h, i) => (
                            <div key={i} style={{ padding: '10px 12px', borderRadius: '8px', backgroundColor: '#f9fafb', border: '1px solid #e5e7eb', marginBottom: '8px', fontSize: '13px', color: '#374151' }}>
                              <span style={{ fontSize: '11px', fontWeight: '700', color: '#9ca3af', display: 'block', marginBottom: '3px' }}>{h.status}</span>
                              {h.note}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Activity history */}
                      {selected.statusHistory?.length > 0 && (
                        <div>
                          <p style={{ margin: '0 0 12px', fontSize: '11px', fontWeight: '700', color: '#9ca3af', letterSpacing: '0.6px' }}>ACTIVITY</p>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {[...selected.statusHistory].reverse().map((h, i) => {
                              const s = STATUS_STYLES[h.status] || DEFAULT_STATUS_STYLE
                              return (
                                <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: s.color, marginTop: '5px', flexShrink: 0 }} />
                                  <div>
                                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                                      <span style={{ fontSize: '12px', fontWeight: '700', color: '#1a1a1a' }}>{h.status}</span>
                                      <span style={{ fontSize: '11px', color: '#9ca3af' }}>by {h.assignedTo && h.assignedTo !== 'Unassigned' ? h.assignedTo : h.changedBy} · {new Date(h.timestamp).toLocaleDateString('en-IN')}</span>
                                    </div>
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Right col — update panel */}
                    <div style={{ backgroundColor: '#f9fafb', borderRadius: '14px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px', height: 'fit-content' }}>
                      <p style={{ margin: 0, fontSize: '13px', fontWeight: '800', color: '#1a1a1a' }}>Update Complaint</p>

                      <div>
                        <label style={{ fontSize: '11px', fontWeight: '700', color: '#6b7280', display: 'block', marginBottom: '5px' }}>STATUS</label>
                        <select value={editStatus} onChange={e => setEditStatus(e.target.value)}
                          style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1.5px solid #e5e7eb', fontSize: '13px', outline: 'none', backgroundColor: '#fff' }}>
                          {['Complaint Registered', 'Assigned to Field Officer'].map(s => <option key={s}>{s}</option>)}
                        </select>
                      </div>

                      <div>
                        <label style={{ fontSize: '11px', fontWeight: '700', color: '#6b7280', display: 'block', marginBottom: '5px' }}>ASSIGNED TO</label>
                        <select value={editAssigned === 'Unassigned' ? '' : editAssigned} onChange={e => { setEditAssigned(e.target.value); if (e.target.value) setEditStatus('Assigned to Field Officer') }}
                          style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1.5px solid #e5e7eb', fontSize: '13px', outline: 'none', boxSizing: 'border-box', backgroundColor: '#fff', cursor: 'pointer' }}>
                          <option value="">— Select Officer —</option>
                          {officers.map(o => (
                            <option key={o._id} value={o.name}>{o.name} ({o.department?.name || 'No dept'})</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label style={{ fontSize: '11px', fontWeight: '700', color: '#6b7280', display: 'block', marginBottom: '5px' }}>NOTE</label>
                        <textarea value={editNote} onChange={e => setEditNote(e.target.value)}
                          placeholder="Add a note..."
                          rows={3}
                          style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1.5px solid #e5e7eb', fontSize: '13px', outline: 'none', resize: 'none', boxSizing: 'border-box', backgroundColor: '#fff' }} />
                      </div>

                      <div>
                        <label style={{ fontSize: '11px', fontWeight: '700', color: '#6b7280', display: 'block', marginBottom: '8px' }}>UPLOAD PHOTO</label>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button type="button" onClick={openAdminCamera}
                            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '9px', borderRadius: '8px', border: '1.5px solid #e5e7eb', backgroundColor: '#fff', fontSize: '12px', fontWeight: '600', color: '#374151', cursor: 'pointer' }}>
                            <MdCameraAlt size={15} color="#151A40" /> Take Photo
                          </button>
                          <button type="button" onClick={() => photoInputRef.current.click()}
                            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '9px', borderRadius: '8px', border: '1.5px solid #e5e7eb', backgroundColor: '#fff', fontSize: '12px', fontWeight: '600', color: '#374151', cursor: 'pointer' }}>
                            <MdUpload size={15} color="#151A40" /> Upload
                          </button>
                          <input ref={photoInputRef} type="file" accept="image/*" multiple style={{ display: 'none' }}
                            onChange={e => setEditPhotos(p => [...p, ...Array.from(e.target.files)])} />
                        </div>
                        {editPhotos.length > 0 && (
                          <div style={{ marginTop: '8px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                            {editPhotos.map((f, i) => (
                              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '3px 8px', borderRadius: '6px', backgroundColor: '#f3f4f6', fontSize: '11px', color: '#374151' }}>
                                <span style={{ maxWidth: '90px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.name}</span>
                                <button type="button" onClick={() => setEditPhotos(p => p.filter((_, j) => j !== i))}
                                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', fontWeight: '700', padding: 0, lineHeight: 1 }}>×</button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {saveMsg && (
                        <p style={{ margin: 0, fontSize: '12px', fontWeight: '600', color: saveMsg.includes('success') ? '#15803d' : '#dc2626', textAlign: 'center' }}>
                          {saveMsg}
                        </p>
                      )}

                      <button onClick={handleSave} disabled={saving}
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px', padding: '11px', borderRadius: '10px', border: 'none', backgroundColor: saving ? '#93c5fd' : '#151A40', color: '#fff', fontSize: '13px', fontWeight: '700', cursor: saving ? 'wait' : 'pointer' }}>
                        <MdSave size={15} /> {saving ? 'Saving...' : 'Save Changes'}
                      </button>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Delete Confirm */}
      <AnimatePresence>
        {deleteConfirm && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setDeleteConfirm(null)}
              style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', zIndex: 300 }} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
              style={{ position: 'fixed', inset: 0, margin: 'auto', width: '100%', maxWidth: '380px', height: 'fit-content', backgroundColor: '#fff', borderRadius: '20px', padding: '28px', zIndex: 301, textAlign: 'center', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
              <div style={{ width: '52px', height: '52px', borderRadius: '50%', backgroundColor: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
                <MdDelete size={26} color="#dc2626" />
              </div>
              <h3 style={{ margin: '0 0 8px', fontSize: '17px', fontWeight: '800', color: '#1a1a1a' }}>Delete Complaint?</h3>
              <p style={{ margin: '0 0 22px', fontSize: '13px', color: '#6b7280' }}>
                #{deleteConfirm.complaintId} — "{deleteConfirm.title}" will be permanently removed.
              </p>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={() => setDeleteConfirm(null)} style={{ flex: 1, padding: '11px', borderRadius: '10px', border: '1.5px solid #e5e7eb', backgroundColor: '#fff', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>Cancel</button>
                <button onClick={() => handleDelete(deleteConfirm._id)} style={{ flex: 1, padding: '11px', borderRadius: '10px', border: 'none', backgroundColor: '#dc2626', color: '#fff', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}>Delete</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Acceptance Confirmation Modal */}
      <AnimatePresence>
        {acceptedComplaint && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setAcceptedComplaint(null)}
              style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.45)', zIndex: 300 }} />
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
              style={{
                position: 'fixed', inset: 0, margin: 'auto',
                width: '100%', maxWidth: '460px', height: 'fit-content',
                backgroundColor: '#fff', borderRadius: '20px',
                boxShadow: '0 24px 64px rgba(0,0,0,0.2)', zIndex: 301, overflow: 'hidden'
              }}>
              {/* Green header */}
              <div style={{ backgroundColor: '#15803d', padding: '28px', textAlign: 'center' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', fontSize: '28px' }}>
                  ✓
                </div>
                <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '800', color: '#fff' }}>Complaint Accepted</h2>
                <p style={{ margin: '6px 0 0', fontSize: '13px', color: 'rgba(255,255,255,0.8)' }}>Successfully registered and assigned</p>
              </div>

              {/* Details */}
              <div style={{ padding: '24px 28px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <tbody>
                    {[
                      ['Complaint ID', `#${acceptedComplaint.complaintId}`],
                      ['Title', acceptedComplaint.title],
                      ['Department', acceptedComplaint.department],
                      ['Location', acceptedComplaint.location?.address || '—'],
                      ['Submitted On', new Date(acceptedComplaint.createdAt).toLocaleString('en-IN')],
                      ['Status', 'Complaint Registered'],
                    ].map(([label, value]) => (
                      <tr key={label} style={{ borderBottom: '1px solid #f3f4f6' }}>
                        <td style={{ padding: '10px 0', fontSize: '11px', fontWeight: '700', color: '#9ca3af', width: '130px', letterSpacing: '0.4px' }}>
                          {label.toUpperCase()}
                        </td>
                        <td style={{ padding: '10px 0', fontSize: '13px', color: label === 'Status' ? '#15803d' : '#1a1a1a', fontWeight: label === 'Status' ? '700' : '500', wordBreak: 'break-word' }}>
                          {value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <button onClick={() => setAcceptedComplaint(null)}
                  style={{ width: '100%', marginTop: '20px', padding: '13px', borderRadius: '10px', border: 'none', backgroundColor: '#15803d', color: '#fff', fontSize: '14px', fontWeight: '700', cursor: 'pointer' }}>
                  Done
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Admin Camera Modal */}
      <AnimatePresence>
        {showAdminCamera && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 400 }} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
              style={{ position: 'fixed', inset: 0, margin: 'auto', width: '100%', maxWidth: '520px', height: 'fit-content', backgroundColor: '#fff', borderRadius: '20px', overflow: 'hidden', zIndex: 401, boxShadow: '0 24px 64px rgba(0,0,0,0.3)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid #f3f4f6' }}>
                <span style={{ fontWeight: '700', fontSize: '15px', color: '#1a1a1a' }}>Take Photo</span>
                <button onClick={closeAdminCamera} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af' }}>
                  <MdClose size={22} />
                </button>
              </div>
              <div style={{ backgroundColor: '#000', position: 'relative' }}>
                {adminCamError ? (
                  <div style={{ padding: '60px', textAlign: 'center', color: '#9ca3af', backgroundColor: '#f9fafb' }}>
                    <MdCameraAlt size={40} style={{ marginBottom: '10px', opacity: 0.3 }} />
                    <p style={{ margin: 0, fontSize: '14px' }}>{adminCamError}</p>
                  </div>
                ) : (
                  <video ref={adminVideoRef} autoPlay playsInline muted
                    style={{ width: '100%', display: 'block', maxHeight: '55vh', objectFit: 'cover' }} />
                )}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '24px', padding: '20px' }}>
                <button onClick={() => { const next = adminFacing === 'environment' ? 'user' : 'environment'; setAdminFacing(next); startAdminCamera(next) }}
                  style={{ width: '44px', height: '44px', borderRadius: '50%', border: '1px solid #e5e7eb', backgroundColor: '#f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                  <MdFlipCameraAndroid size={20} color="#374151" />
                </button>
                <button onClick={captureAdminPhoto} disabled={!!adminCamError}
                  style={{ width: '64px', height: '64px', borderRadius: '50%', border: '4px solid rgba(37,150,190,0.25)', backgroundColor: adminCamError ? '#e5e7eb' : '#151A40', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: adminCamError ? 'not-allowed' : 'pointer', boxShadow: '0 4px 14px rgba(37,150,190,0.35)' }}>
                  <MdCameraAlt size={28} color="#fff" />
                </button>
                <div style={{ width: '44px' }} />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </AdminLayout>
  )
}
