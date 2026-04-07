import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MdOutlineEngineering, MdAdd, MdDelete, MdEmail,
  MdLockOutline, MdPerson, MdBusiness, MdClose, MdCheck,
  MdPhone, MdRemoveRedEye, MdEdit, MdVisibility, MdVisibilityOff
} from 'react-icons/md'
import AdminLayout from './AdminLayout'
import api from '../../utils/secureApi'
import toast, { Toaster } from 'react-hot-toast'

export default function OfficerManagement() {
  const [officers, setOfficers] = useState([])
  const [departments, setDepartments] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', departmentId: '' })
  const [showPassword, setShowPassword] = useState(false)

  const [viewOfficer, setViewOfficer] = useState(null)
  const [editOfficer, setEditOfficer] = useState(null)
  const [editForm, setEditForm] = useState({ name: '', email: '', phone: '', departmentId: '' })
  const [editLoading, setEditLoading] = useState(false)

  useEffect(() => { fetchOfficers(); fetchDepartments() }, [])

  const fetchOfficers = async () => {
    try {
      const res = await api.get('/admin/officers')
      if (res.success) setOfficers(res.data)
    } catch { toast.error('Failed to load officers') }
    finally { setFetching(false) }
  }

  const fetchDepartments = async () => {
    try {
      const res = await api.get('/departments/all')
      if (res.success) setDepartments(res.data)
    } catch {
      try { const res = await api.get('/departments'); if (res.success) setDepartments(res.data) } catch {}
    }
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await api.post('/admin/officers', {
        name: form.name, email: form.email, password: form.password,
        phone: form.phone, departmentId: form.departmentId,
      })
      if (res.success) {
        toast.success('Officer created successfully')
        setShowModal(false)
        setForm({ name: '', email: '', password: '', phone: '', departmentId: '' })
        setShowPassword(false)
        fetchOfficers()
      }
    } catch (err) {
      toast.error(err.message || 'Failed to create officer')
    } finally { setLoading(false) }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this officer?')) return
    try {
      await api.delete(`/admin/officers/${id}`)
      toast.success('Officer deleted')
      setOfficers(prev => prev.filter(o => o._id !== id))
    } catch { toast.error('Failed to delete officer') }
  }

  const openEdit = (officer) => {
    setEditOfficer(officer)
    setEditForm({
      name: officer.name,
      email: officer.email,
      phone: officer.phone || '',
      departmentId: officer.department?._id || '',
    })
  }

  const handleEdit = async (e) => {
    e.preventDefault()
    setEditLoading(true)
    try {
      const res = await api.patch(`/admin/officers/${editOfficer._id}`, {
        name: editForm.name,
        email: editForm.email,
        phone: editForm.phone,
        departmentId: editForm.departmentId,
      })
      if (res.success) {
        toast.success('Officer updated')
        setEditOfficer(null)
        fetchOfficers()
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update officer')
    } finally { setEditLoading(false) }
  }

  return (
    <AdminLayout active="officers">
      <Toaster />

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '900', color: '#1a1a1a', margin: '0 0 6px' }}>Sector Officer Management</h1>
          <p style={{ fontSize: '15px', color: '#6b5e52', margin: 0 }}>Create and manage field officers by department</p>
        </div>
        <motion.button whileTap={{ scale: 0.97 }} onClick={() => setShowModal(true)}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px', borderRadius: '12px', backgroundColor: '#151A40', color: '#fff', fontSize: '14px', fontWeight: '700', border: 'none', cursor: 'pointer' }}>
          <MdAdd size={18} /> Add Officer
        </motion.button>
      </div>

      {/* Table */}
      <div style={{ backgroundColor: '#fff', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
        {fetching ? (
          <div style={{ padding: '48px', textAlign: 'center', color: '#9e8e80' }}>Loading officers...</div>
        ) : officers.length === 0 ? (
          <div style={{ padding: '64px', textAlign: 'center' }}>
            <MdOutlineEngineering size={48} color="#e0d5c8" style={{ marginBottom: '16px' }} />
            <p style={{ fontSize: '16px', color: '#9e8e80', margin: 0 }}>No officers added yet.</p>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#faf6f0', borderBottom: '1px solid #f0e8dc' }}>
                {['Name', 'Email', 'Department', 'Status', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '14px 20px', textAlign: 'left', fontSize: '12px', fontWeight: '700', color: '#6b5e52', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {officers.map((officer, i) => (
                <motion.tr key={officer._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} style={{ borderBottom: '1px solid #f5f0ea' }}>
                  <td style={{ padding: '16px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#fef0e6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <MdOutlineEngineering size={18} color="#151A40" />
                      </div>
                      <span style={{ fontSize: '14px', fontWeight: '600', color: '#1a1a1a' }}>{officer.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: '16px 20px', fontSize: '14px', color: '#6b5e52' }}>{officer.email}</td>
                  <td style={{ padding: '16px 20px' }}>
                    <span style={{ fontSize: '13px', fontWeight: '600', color: '#151A40', backgroundColor: '#fef0e6', padding: '4px 10px', borderRadius: '8px' }}>
                      {officer.department?.name || '—'}
                    </span>
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    <span style={{ fontSize: '12px', fontWeight: '700', padding: '4px 10px', borderRadius: '8px', backgroundColor: officer.isActive ? '#edf7f1' : '#fef2f2', color: officer.isActive ? '#41A465' : '#ef4444' }}>
                      {officer.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <button onClick={() => setViewOfficer(officer)} title="View"
                        style={{ width: '32px', height: '32px', borderRadius: '8px', border: '1px solid #e0d5c8', backgroundColor: '#faf6f0', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                        <MdRemoveRedEye size={16} color="#151A40" />
                      </button>
                      <button onClick={() => openEdit(officer)} title="Edit"
                        style={{ width: '32px', height: '32px', borderRadius: '8px', border: '1px solid #dbeafe', backgroundColor: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                        <MdEdit size={16} color="#2563eb" />
                      </button>
                      <button onClick={() => handleDelete(officer._id)} title="Delete"
                        style={{ width: '32px', height: '32px', borderRadius: '8px', border: '1px solid #fee2e2', backgroundColor: '#fff5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                        <MdDelete size={16} color="#ef4444" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* View Modal */}
      <AnimatePresence>
        {viewOfficer && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}
            onClick={e => e.target === e.currentTarget && setViewOfficer(null)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '28px', width: '100%', maxWidth: '420px', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: '900', color: '#1a1a1a', margin: 0 }}>Officer Details</h2>
                <button onClick={() => setViewOfficer(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9e8e80' }}><MdClose size={22} /></button>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px', padding: '16px', backgroundColor: '#faf6f0', borderRadius: '12px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#fef0e6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <MdOutlineEngineering size={24} color="#151A40" />
                </div>
                <div>
                  <p style={{ fontSize: '16px', fontWeight: '800', color: '#1a1a1a', margin: '0 0 2px' }}>{viewOfficer.name}</p>
                  <span style={{ fontSize: '12px', fontWeight: '700', padding: '2px 8px', borderRadius: '6px', backgroundColor: viewOfficer.isActive ? '#edf7f1' : '#fef2f2', color: viewOfficer.isActive ? '#41A465' : '#ef4444' }}>
                    {viewOfficer.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
              {[
                { icon: <MdEmail size={15} />, label: 'Email', value: viewOfficer.email },
                { icon: <MdPhone size={15} />, label: 'Phone', value: viewOfficer.phone ? `+91 ${viewOfficer.phone}` : '—' },
                { icon: <MdBusiness size={15} />, label: 'Department', value: viewOfficer.department?.name || '—' },
              ].map(row => (
                <div key={row.label} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 0', borderBottom: '1px solid #f5f0ea' }}>
                  <span style={{ color: '#151A40' }}>{row.icon}</span>
                  <span style={{ fontSize: '12px', color: '#9e8e80', width: '80px', fontWeight: '600' }}>{row.label}</span>
                  <span style={{ fontSize: '14px', color: '#1a1a1a', fontWeight: '500' }}>{row.value}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Modal */}
      <AnimatePresence>
        {editOfficer && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}
            onClick={e => e.target === e.currentTarget && setEditOfficer(null)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '24px', width: '100%', maxWidth: '440px', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: '900', color: '#1a1a1a', margin: 0 }}>Edit Officer</h2>
                <button onClick={() => setEditOfficer(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9e8e80' }}><MdClose size={22} /></button>
              </div>
              <form onSubmit={handleEdit}>
                <FieldLabel icon={<MdPerson size={14} />} label="Full Name" />
                <input type="text" value={editForm.name} onChange={e => setEditForm(p => ({ ...p, name: e.target.value }))} required style={inputStyle} />

                <FieldLabel icon={<MdEmail size={14} />} label="Email Address" />
                <input type="email" value={editForm.email} onChange={e => setEditForm(p => ({ ...p, email: e.target.value }))} required style={inputStyle} />

                <FieldLabel icon={<MdPhone size={14} />} label="Phone Number" />
                <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid #e0d5c8', borderRadius: '10px', overflow: 'hidden', backgroundColor: '#faf6f0', marginBottom: '10px' }}>
                  <span style={{ padding: '9px 12px', fontSize: '13px', fontWeight: '600', color: '#555', backgroundColor: '#f0e8dc', borderRight: '1px solid #e0d5c8' }}>+91</span>
                  <input type="tel" maxLength={10} value={editForm.phone} onChange={e => setEditForm(p => ({ ...p, phone: e.target.value.replace(/\D/g, '') }))}
                    style={{ flex: 1, padding: '9px 12px', fontSize: '13px', color: '#1a1a1a', backgroundColor: 'transparent', border: 'none', outline: 'none' }} />
                </div>

                <FieldLabel icon={<MdBusiness size={14} />} label="Department" />
                <select value={editForm.departmentId} onChange={e => setEditForm(p => ({ ...p, departmentId: e.target.value }))} required style={{ ...inputStyle, cursor: 'pointer' }}>
                  <option value="">Select a department</option>
                  {departments.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
                </select>

                <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
                  <button type="button" onClick={() => setEditOfficer(null)}
                    style={{ flex: 1, padding: '11px', borderRadius: '12px', border: '1.5px solid #e0d5c8', backgroundColor: 'transparent', color: '#6b5e52', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
                    Cancel
                  </button>
                  <motion.button type="submit" disabled={editLoading} whileTap={{ scale: 0.97 }}
                    style={{ flex: 1, padding: '11px', borderRadius: '12px', border: 'none', backgroundColor: editLoading ? '#9e8e80' : '#2563eb', color: '#fff', fontSize: '14px', fontWeight: '700', cursor: editLoading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                    {editLoading ? 'Saving...' : <><MdCheck size={16} /> Save Changes</>}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Officer Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}
            onClick={e => e.target === e.currentTarget && setShowModal(false)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '24px', width: '100%', maxWidth: '480px', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div>
                  <h2 style={{ fontSize: '20px', fontWeight: '900', color: '#1a1a1a', margin: '0 0 4px' }}>Add New Sector Officer</h2>
                  <p style={{ fontSize: '13px', color: '#9e8e80', margin: 0 }}>Credentials will be shared with the officer</p>
                </div>
                <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9e8e80' }}><MdClose size={22} /></button>
              </div>
              <form onSubmit={handleCreate}>
                <FieldLabel icon={<MdPerson size={14} />} label="Full Name" />
                <input autoComplete="off" type="text" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Officer full name" required style={inputStyle} />

                <FieldLabel icon={<MdEmail size={14} />} label="Email Address" />
                <input autoComplete="off" type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="officer@example.com" required style={inputStyle} />

                <FieldLabel icon={<MdPhone size={14} />} label="Phone Number" />
                <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid #e0d5c8', borderRadius: '10px', overflow: 'hidden', backgroundColor: '#faf6f0', marginBottom: '10px' }}>
                  <span style={{ padding: '9px 12px', fontSize: '13px', fontWeight: '600', color: '#555', backgroundColor: '#f0e8dc', borderRight: '1px solid #e0d5c8', whiteSpace: 'nowrap' }}>+91</span>
                  <input autoComplete="off" type="tel" maxLength={10} value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value.replace(/\D/g, '') }))} placeholder="10 digit mobile number" required
                    style={{ flex: 1, padding: '9px 12px', fontSize: '13px', color: '#1a1a1a', backgroundColor: 'transparent', border: 'none', outline: 'none' }} />
                </div>

                <FieldLabel icon={<MdLockOutline size={14} />} label="Password" />
                <div style={{ position: 'relative', marginBottom: '10px' }}>
                  <input autoComplete="new-password" type={showPassword ? 'text' : 'password'} value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} placeholder="Min 6 characters" required minLength={6}
                    style={{ ...inputStyle, marginBottom: 0, paddingRight: '40px' }} />
                  <button type="button" onClick={() => setShowPassword(p => !p)}
                    style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9e8e80', display: 'flex', alignItems: 'center' }}>
                    {showPassword ? <MdVisibilityOff size={18} /> : <MdVisibility size={18} />}
                  </button>
                </div>

                <FieldLabel icon={<MdBusiness size={14} />} label="Department" />
                <select value={form.departmentId} onChange={e => setForm(p => ({ ...p, departmentId: e.target.value }))} required style={{ ...inputStyle, cursor: 'pointer' }}>
                  <option value="">Select a department</option>
                  {departments.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
                </select>

                <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
                  <button type="button" onClick={() => setShowModal(false)}
                    style={{ flex: 1, padding: '13px', borderRadius: '12px', border: '1.5px solid #e0d5c8', backgroundColor: 'transparent', color: '#6b5e52', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
                    Cancel
                  </button>
                  <motion.button type="submit" disabled={loading} whileTap={{ scale: 0.97 }}
                    style={{ flex: 1, padding: '13px', borderRadius: '12px', border: 'none', backgroundColor: loading ? '#9e8e80' : '#151A40', color: '#fff', fontSize: '14px', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                    {loading ? 'Creating...' : <><MdCheck size={16} /> Create Officer</>}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminLayout>
  )
}

function FieldLabel({ icon, label }) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: '600', color: '#3a3a3a', marginBottom: '5px' }}>
      <span style={{ color: '#151A40' }}>{icon}</span> {label}
    </label>
  )
}

const inputStyle = {
  width: '100%', padding: '9px 12px', fontSize: '13px', color: '#1a1a1a',
  border: '1.5px solid #e0d5c8', borderRadius: '10px', backgroundColor: '#faf6f0',
  outline: 'none', marginBottom: '10px', boxSizing: 'border-box',
}
