import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MdAdd, MdEdit, MdDelete, MdClose, MdBusiness } from 'react-icons/md'
import AdminLayout from './AdminLayout'
import { departmentAPI } from '../../utils/secureApi'

const ICON_OPTIONS = [
  'MdAgriculture', 'MdSchool', 'MdLocalHospital', 'MdLocalPolice',
  'MdAccountBalance', 'MdConstruction', 'MdWaterDrop', 'MdDelete',
  'MdPark', 'MdBusiness', 'MdElectricBolt', 'MdDirectionsBus',
  'MdHomeWork', 'MdForest', 'MdSecurity'
]

const emptyForm = { name: '', icon: 'MdAccountBalance' }

export default function DepartmentManagement() {
  const [departments, setDepartments] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editTarget, setEditTarget] = useState(null) // null = create, obj = edit
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  const fetchDepartments = async () => {
    try {
      const res = await departmentAPI.getAllAdmin()
      setDepartments(res.data)
    } catch {
      setError('Failed to load departments')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchDepartments() }, [])

  const openCreate = () => {
    setEditTarget(null)
    setForm(emptyForm)
    setError('')
    setShowModal(true)
  }

  const openEdit = (dept) => {
    setEditTarget(dept)
    setForm({ name: dept.name, icon: dept.icon || 'MdAccountBalance' })
    setError('')
    setShowModal(true)
  }

  const handleSave = async () => {
    if (!form.name.trim()) { setError('Department name is required'); return }
    setSaving(true)
    setError('')
    try {
      if (editTarget) {
        await departmentAPI.update(editTarget._id, form)
      } else {
        await departmentAPI.create(form)
      }
      setShowModal(false)
      fetchDepartments()
    } catch (err) {
      setError(err.message || 'Failed to save department')
    } finally {
      setSaving(false)
    }
  }

  const handleToggleActive = async (dept) => {
    try {
      await departmentAPI.update(dept._id, { ...dept, isActive: !dept.isActive })
      fetchDepartments()
    } catch {
      setError('Failed to update status')
    }
  }

  const handleDelete = async (id) => {
    try {
      await departmentAPI.delete(id)
      setDeleteConfirm(null)
      fetchDepartments()
    } catch {
      setError('Failed to delete department')
    }
  }

  return (
    <AdminLayout active="departments">
      <div style={{ maxWidth: '900px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: '900', color: '#1a1a1a', margin: '0 0 8px' }}>Departments</h1>
            <p style={{ fontSize: '15px', color: '#6b5e52', margin: 0 }}>
              Manage departments shown in the complaint submission form
            </p>
          </div>
          <button onClick={openCreate} style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '12px 24px', borderRadius: '12px',
            backgroundColor: '#2596be', color: '#fff', border: 'none',
            fontSize: '14px', fontWeight: '700', cursor: 'pointer'
          }}>
            <MdAdd size={20} /> Add Department
          </button>
        </div>

        {error && !showModal && (
          <div style={{ padding: '12px 16px', borderRadius: '10px', backgroundColor: '#fef2f2', color: '#dc2626', marginBottom: '20px', fontSize: '14px' }}>
            {error}
          </div>
        )}

        {/* Table */}
        <div style={{ backgroundColor: '#fff', borderRadius: '16px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
          {loading ? (
            <div style={{ padding: '60px', textAlign: 'center', color: '#9ca3af' }}>Loading...</div>
          ) : departments.length === 0 ? (
            <div style={{ padding: '60px', textAlign: 'center', color: '#9ca3af' }}>
              <MdBusiness size={48} style={{ marginBottom: '12px', opacity: 0.3 }} />
              <p style={{ margin: 0 }}>No departments yet. Add one to get started.</p>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                  {['Department', 'Icon Key', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '14px 20px', textAlign: 'left', fontSize: '12px', fontWeight: '700', color: '#6b7280', letterSpacing: '0.5px' }}>
                      {h.toUpperCase()}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {departments.map((dept, i) => (
                  <motion.tr
                    key={dept._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    style={{ borderBottom: '1px solid #f3f4f6' }}
                  >
                    <td style={{ padding: '16px 20px', fontWeight: '600', color: '#1a1a1a', fontSize: '14px' }}>
                      {dept.name}
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <code style={{ fontSize: '12px', backgroundColor: '#f3f4f6', padding: '3px 8px', borderRadius: '6px', color: '#374151' }}>
                        {dept.icon || '—'}
                      </code>
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => openEdit(dept)} style={{
                          padding: '7px', borderRadius: '8px', border: '1px solid #e5e7eb',
                          backgroundColor: '#fff', cursor: 'pointer', color: '#2596be', display: 'flex'
                        }}>
                          <MdEdit size={16} />
                        </button>
                        <button onClick={() => setDeleteConfirm(dept)} style={{
                          padding: '7px', borderRadius: '8px', border: '1px solid #fee2e2',
                          backgroundColor: '#fff', cursor: 'pointer', color: '#dc2626', display: 'flex'
                        }}>
                          <MdDelete size={16} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Create / Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', zIndex: 200 }} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
              style={{
                position: 'fixed', inset: 0, margin: 'auto',
                height: 'fit-content',
                backgroundColor: '#fff', borderRadius: '20px', padding: '32px',
                width: '100%', maxWidth: '480px', zIndex: 201, boxShadow: '0 20px 60px rgba(0,0,0,0.2)'
              }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '800', color: '#1a1a1a' }}>
                  {editTarget ? 'Edit Department' : 'New Department'}
                </h2>
                <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af' }}>
                  <MdClose size={24} />
                </button>
              </div>

              {error && (
                <div style={{ padding: '10px 14px', borderRadius: '8px', backgroundColor: '#fef2f2', color: '#dc2626', marginBottom: '16px', fontSize: '13px' }}>
                  {error}
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: '700', color: '#374151', display: 'block', marginBottom: '6px' }}>
                    Department Name *
                  </label>
                  <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="e.g. Agriculture"
                    style={{
                      width: '100%', padding: '12px 14px', borderRadius: '10px',
                      border: '1.5px solid #e0d5c8', backgroundColor: '#faf6f0',
                      fontSize: '14px', outline: 'none', boxSizing: 'border-box'
                    }} />
                </div>

                <div>
                  <label style={{ fontSize: '13px', fontWeight: '700', color: '#374151', display: 'block', marginBottom: '6px' }}>
                    Icon Key
                  </label>
                  <select value={form.icon} onChange={e => setForm(f => ({ ...f, icon: e.target.value }))}
                    style={{
                      width: '100%', padding: '12px 14px', borderRadius: '10px',
                      border: '1.5px solid #e0d5c8', backgroundColor: '#faf6f0',
                      fontSize: '14px', outline: 'none', boxSizing: 'border-box'
                    }}>
                    {ICON_OPTIONS.map(ic => <option key={ic} value={ic}>{ic}</option>)}
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <button onClick={() => setShowModal(false)} style={{
                  flex: 1, padding: '13px', borderRadius: '10px',
                  border: '1.5px solid #e0d5c8', backgroundColor: '#fff',
                  fontSize: '14px', fontWeight: '600', cursor: 'pointer', color: '#374151'
                }}>
                  Cancel
                </button>
                <button onClick={handleSave} disabled={saving} style={{
                  flex: 1, padding: '13px', borderRadius: '10px',
                  border: 'none', backgroundColor: saving ? '#93c5fd' : '#2596be',
                  fontSize: '14px', fontWeight: '700', cursor: saving ? 'wait' : 'pointer', color: '#fff'
                }}>
                  {saving ? 'Saving...' : editTarget ? 'Save Changes' : 'Create'}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Delete Confirm Modal */}
      <AnimatePresence>
        {deleteConfirm && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setDeleteConfirm(null)}
              style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', zIndex: 200 }} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
              style={{
                position: 'fixed', inset: 0, margin: 'auto',
                height: 'fit-content',
                backgroundColor: '#fff', borderRadius: '20px', padding: '32px',
                width: '100%', maxWidth: '400px', zIndex: 201, textAlign: 'center',
                boxShadow: '0 20px 60px rgba(0,0,0,0.2)'
              }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <MdDelete size={28} color="#dc2626" />
              </div>
              <h3 style={{ margin: '0 0 8px', fontSize: '18px', fontWeight: '800', color: '#1a1a1a' }}>Delete Department?</h3>
              <p style={{ margin: '0 0 24px', fontSize: '14px', color: '#6b5e52' }}>
                "{deleteConfirm.name}" will be permanently removed.
              </p>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button onClick={() => setDeleteConfirm(null)} style={{
                  flex: 1, padding: '13px', borderRadius: '10px',
                  border: '1.5px solid #e0d5c8', backgroundColor: '#fff',
                  fontSize: '14px', fontWeight: '600', cursor: 'pointer'
                }}>Cancel</button>
                <button onClick={() => handleDelete(deleteConfirm._id)} style={{
                  flex: 1, padding: '13px', borderRadius: '10px',
                  border: 'none', backgroundColor: '#dc2626',
                  fontSize: '14px', fontWeight: '700', cursor: 'pointer', color: '#fff'
                }}>Delete</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </AdminLayout>
  )
}
