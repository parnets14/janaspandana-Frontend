import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  MdSearch, 
  MdPhone,
  MdVerified,
  MdBlock,
  MdVisibility,
  MdDelete,
  MdClose,
  MdPerson,
  MdLocationOn,
  MdBadge,
  MdCalendarToday,
  MdRefresh
} from 'react-icons/md'
import AdminLayout from './AdminLayout'
import api from '../../utils/secureApi'

export default function UserManagement() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRole, setFilterRole] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedUser, setSelectedUser] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [zoomImage, setZoomImage] = useState(null)

  useEffect(() => {
    fetchUsers()
    // Re-fetch when window regains focus
    window.addEventListener('focus', fetchUsers)
    return () => window.removeEventListener('focus', fetchUsers)
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await api.get('/admin/users')
      if (response.success) {
        setUsers(response.data)
      } else {
        console.error('Failed to fetch users:', response.message)
      }
    } catch (error) {
      console.error('Failed to fetch users', error)
      // If token expired, try to re-fetch after a moment
      if (error.message?.includes('Session expired')) {
        window.location.href = '/admin-login'
      }
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (userId) => {
    try {
      const response = await api.delete(`/admin/users/${userId}`)
      if (response.success) {
        setUsers(prev => prev.filter(u => u._id !== userId))
        setDeleteConfirm(null)
      }
    } catch (error) {
      console.error('Failed to delete user', error)
    }
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm) ||
      (user.aadhaar && user.aadhaar.includes(searchTerm))
    
    const matchesRole = filterRole === 'all' || user.role === filterRole
    const matchesStatus = filterStatus === 'all' || 
      (filterStatus === 'active' && user.isActive) ||
      (filterStatus === 'inactive' && !user.isActive)
    
    return matchesSearch && matchesRole && matchesStatus
  })

  const stats = {
    total: users.length,
    active: users.filter(u => u.isActive).length,
    verified: users.filter(u => u.isVerified).length,
    citizens: users.filter(u => u.role === 'citizen').length,
    operators: users.filter(u => u.role === 'operator').length,
    officers: users.filter(u => u.role === 'officer').length,
  }

  return (
    <AdminLayout active="users">
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#1a1a1a', margin: '0 0 8px 0' }}>
              User Management
            </h1>
            <p style={{ color: '#666', margin: 0 }}>
              Manage all registered users in the system
            </p>
          </div>
          <button onClick={fetchUsers} style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '10px 18px', borderRadius: '10px',
            border: '1px solid #e5e7eb', backgroundColor: '#fff',
            fontSize: '13px', fontWeight: '600', cursor: 'pointer', color: '#374151'
          }}>
            <MdRefresh size={16} /> Refresh
          </button>
        </div>



        {/* Filters */}
        <div style={{
          backgroundColor: '#fff',
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '16px',
            alignItems: 'end'
          }}>
            {/* Search */}
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#1a1a1a' }}>
                Search Users
              </label>
              <div style={{ position: 'relative' }}>
                <MdSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} size={20} />
                <input
                  type="text"
                  placeholder="Name, phone, or Aadhaar..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px 10px 40px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                />
              </div>
            </div>


          </div>
        </div>

        {/* Users Table */}
        <div style={{
          backgroundColor: '#fff',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          {loading ? (
            <div style={{ padding: '60px', textAlign: 'center', color: '#666' }}>
              Loading users...
            </div>
          ) : filteredUsers.length === 0 ? (
            <div style={{ padding: '60px', textAlign: 'center', color: '#666' }}>
              No users found
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                    <th style={tableHeaderStyle}>User</th>
                    <th style={tableHeaderStyle}>Phone</th>
                    <th style={tableHeaderStyle}>Role</th>
                    <th style={tableHeaderStyle}>Verified</th>
                    <th style={tableHeaderStyle}>Registered</th>
                    <th style={tableHeaderStyle}>Last Login</th>
                    <th style={tableHeaderStyle}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <motion.tr
                      key={user._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      style={{ borderBottom: '1px solid #e5e7eb' }}
                      whileHover={{ backgroundColor: '#f9fafb' }}
                    >
                      <td style={tableCellStyle}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          {user.photo ? (
                            <img 
                              src={user.photo} 
                              alt={user.name}
                              style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                objectFit: 'cover'
                              }}
                            />
                          ) : (
                            <div style={{
                              width: '40px',
                              height: '40px',
                              borderRadius: '50%',
                              background: 'linear-gradient(135deg, #2596be, #1a7a9e)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#fff',
                              fontWeight: '600'
                            }}>
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div>
                            <div style={{ fontWeight: '600', color: '#1a1a1a' }}>{user.name}</div>
                            <div style={{ fontSize: '12px', color: '#666' }}>{user.address}</div>
                          </div>
                        </div>
                      </td>
                      <td style={tableCellStyle}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <MdPhone size={16} color="#666" />
                          {user.phone}
                        </div>
                      </td>
                      <td style={tableCellStyle}>
                        <span style={{
                          padding: '4px 12px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: '600',
                          backgroundColor: getRoleColor(user.role).bg,
                          color: getRoleColor(user.role).text
                        }}>
                          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        </span>
                      </td>
                      <td style={tableCellStyle}>
                        {user.isVerified ? (
                          <MdVerified size={20} color="#10b981" />
                        ) : (
                          <MdBlock size={20} color="#ef4444" />
                        )}
                      </td>
                      <td style={tableCellStyle}>
                        {new Date(user.createdAt).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </td>
                      <td style={tableCellStyle}>
                        {user.lastLogin ? (
                          new Date(user.lastLogin).toLocaleDateString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                          })
                        ) : (
                          <span style={{ color: '#9ca3af' }}>Never</span>
                        )}
                      </td>
                      <td style={tableCellStyle}>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            onClick={() => setSelectedUser(user)}
                            title="View Details"
                            style={{
                              background: '#dbeafe',
                              border: 'none',
                              borderRadius: '8px',
                              padding: '6px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            <MdVisibility size={18} color="#1e40af" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(user)}
                            title="Delete User"
                            style={{
                              background: '#fee2e2',
                              border: 'none',
                              borderRadius: '8px',
                              padding: '6px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            <MdDelete size={18} color="#dc2626" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div style={{ marginTop: '16px', textAlign: 'center', color: '#666', fontSize: '14px' }}>
          Showing {filteredUsers.length} of {users.length} users
        </div>
      </div>

      {/* View User Modal */}
      <AnimatePresence>
        {selectedUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedUser(null)}
            style={{
              position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '16px'
            }}
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 28 }}
              onClick={e => e.stopPropagation()}
              style={{
                backgroundColor: '#fff', borderRadius: '14px',
                width: '100%', maxWidth: '460px',
                boxShadow: '0 16px 48px rgba(0,0,0,0.18)',
                overflow: 'hidden', maxHeight: '90vh', overflowY: 'auto',
                position: 'relative'
              }}
            >
              {/* Close button — outside header, always on top */}
              <button
                onClick={(e) => { e.stopPropagation(); setSelectedUser(null) }}
                style={{
                  position: 'absolute', top: '10px', right: '10px', zIndex: 10,
                  background: 'rgba(255,255,255,0.25)', border: 'none',
                  borderRadius: '50%', width: '30px', height: '30px',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  backdropFilter: 'blur(4px)'
                }}
              >
                <MdClose size={16} color="#fff" />
              </button>

              {/* Header */}
              <div style={{
                background: 'linear-gradient(135deg, #2596be 0%, #1a7a9e 100%)',
                padding: '16px 16px 28px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {/* Clickable profile photo */}
                  {selectedUser.photo ? (
                    <img
                      src={selectedUser.photo}
                      alt={selectedUser.name}
                      onClick={(e) => { e.stopPropagation(); setZoomImage(selectedUser.photo) }}
                      style={{
                        width: '46px', height: '46px', borderRadius: '50%', objectFit: 'cover',
                        border: '2px solid rgba(255,255,255,0.5)', flexShrink: 0,
                        cursor: 'zoom-in'
                      }}
                    />
                  ) : (
                    <div style={{
                      width: '46px', height: '46px', borderRadius: '50%', flexShrink: 0,
                      background: 'rgba(255,255,255,0.2)', border: '2px solid rgba(255,255,255,0.4)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#fff', fontWeight: '700', fontSize: '20px'
                    }}>
                      {selectedUser.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: '700', color: '#fff', marginBottom: '4px' }}>
                      {selectedUser.name}
                    </div>
                    <div style={{ display: 'flex', gap: '5px' }}>
                      <span style={{
                        padding: '1px 9px', borderRadius: '20px', fontSize: '11px', fontWeight: '600',
                        background: 'rgba(255,255,255,0.2)', color: '#fff'
                      }}>
                        {selectedUser.role.charAt(0).toUpperCase() + selectedUser.role.slice(1)}
                      </span>
                      <span style={{
                        padding: '1px 9px', borderRadius: '20px', fontSize: '11px', fontWeight: '600',
                        background: selectedUser.isVerified ? 'rgba(16,185,129,0.4)' : 'rgba(239,68,68,0.4)',
                        color: '#fff'
                      }}>
                        {selectedUser.isVerified ? '✓ Verified' : '✗ Unverified'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Fields — 2 column grid */}
              <div style={{ padding: '0 14px 16px', marginTop: '-14px' }}>
                <div style={{
                  background: '#fff', borderRadius: '10px',
                  border: '1px solid #e5e7eb',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
                  overflow: 'hidden'
                }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderBottom: '1px solid #f3f4f6' }}>
                    <MiniField icon={<MdPhone size={13} color="#2596be" />} label="Phone" value={selectedUser.phone} />
                    <MiniField icon={<MdBadge size={13} color="#2596be" />} label="Aadhaar" value={selectedUser.maskedAadhaar || 'XXXX-XXXX-' + (selectedUser.aadhaar?.slice(-4) || '****')} border />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderBottom: '1px solid #f3f4f6' }}>
                    <MiniField icon={<MdCalendarToday size={13} color="#2596be" />} label="Registered" value={new Date(selectedUser.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })} />
                    <MiniField icon={<MdCalendarToday size={13} color="#2596be" />} label="Last Login" value={selectedUser.lastLogin ? new Date(selectedUser.lastLogin).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Never'} border />
                  </div>
                  <div style={{ padding: '10px 14px', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <div style={{ width: '26px', height: '26px', borderRadius: '6px', background: '#eff9fd', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <MdLocationOn size={13} color="#2596be" />
                    </div>
                    <div>
                      <div style={{ fontSize: '10px', fontWeight: '700', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '2px' }}>Address</div>
                      <div style={{ fontSize: '13px', color: '#1a1a1a', fontWeight: '500' }}>{selectedUser.address || '—'}</div>
                    </div>
                  </div>
                </div>

                {/* Aadhaar Photo — portrait, clickable */}
                {selectedUser.aadhaarPhoto && (
                  <div style={{ marginTop: '12px' }}>
                    <div style={{ fontSize: '10px', fontWeight: '700', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '6px' }}>
                      Aadhaar Document
                    </div>
                    <img
                      src={selectedUser.aadhaarPhoto}
                      alt="Aadhaar"
                      onClick={(e) => { e.stopPropagation(); setZoomImage(selectedUser.aadhaarPhoto) }}
                      style={{
                        display: 'block', margin: '0 auto',
                        maxWidth: '100%', width: 'auto',
                        maxHeight: '220px',
                        borderRadius: '8px', border: '1px solid #e5e7eb',
                        objectFit: 'contain', cursor: 'zoom-in'
                      }}
                    />
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Image Zoom Lightbox */}
      <AnimatePresence>
        {zoomImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setZoomImage(null)}
            style={{
              position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              zIndex: 2000, padding: '24px', cursor: 'zoom-out'
            }}
          >
            <button
              onClick={() => setZoomImage(null)}
              style={{
                position: 'absolute', top: '16px', right: '16px',
                background: 'rgba(255,255,255,0.15)', border: 'none',
                borderRadius: '50%', width: '36px', height: '36px',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}
            >
              <MdClose size={20} color="#fff" />
            </button>
            <motion.img
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              src={zoomImage}
              alt="Preview"
              onClick={e => e.stopPropagation()}
              style={{
                maxWidth: '90vw', maxHeight: '85vh',
                borderRadius: '12px', objectFit: 'contain',
                boxShadow: '0 8px 40px rgba(0,0,0,0.5)'
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirm Modal */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setDeleteConfirm(null)}
            style={{
              position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '16px'
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              style={{
                backgroundColor: '#fff', borderRadius: '16px', padding: '32px',
                width: '100%', maxWidth: '400px', textAlign: 'center', boxShadow: '0 20px 60px rgba(0,0,0,0.2)'
              }}
            >
              <div style={{
                width: '56px', height: '56px', borderRadius: '50%', background: '#fee2e2',
                display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px'
              }}>
                <MdDelete size={28} color="#dc2626" />
              </div>
              <h3 style={{ margin: '0 0 8px', fontSize: '18px', fontWeight: '700', color: '#1a1a1a' }}>Delete User?</h3>
              <p style={{ margin: '0 0 24px', color: '#666', fontSize: '14px' }}>
                Are you sure you want to delete <strong>{deleteConfirm.name}</strong>? This action cannot be undone.
              </p>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <button
                  onClick={() => setDeleteConfirm(null)}
                  style={{
                    padding: '10px 24px', borderRadius: '8px', border: '1px solid #e5e7eb',
                    background: '#fff', cursor: 'pointer', fontWeight: '600', fontSize: '14px'
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm._id)}
                  style={{
                    padding: '10px 24px', borderRadius: '8px', border: 'none',
                    background: '#dc2626', color: '#fff', cursor: 'pointer', fontWeight: '600', fontSize: '14px'
                  }}
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminLayout>
  )
}

function MiniField({ icon, label, value, border }) {
  return (
    <div style={{
      padding: '10px 14px',
      borderLeft: border ? '1px solid #f3f4f6' : 'none',
      display: 'flex', alignItems: 'flex-start', gap: '8px'
    }}>
      <div style={{
        width: '24px', height: '24px', borderRadius: '6px', background: '#eff9fd',
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
      }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: '10px', fontWeight: '700', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '2px' }}>{label}</div>
        <div style={{ fontSize: '12px', color: '#1a1a1a', fontWeight: '600' }}>{value || '—'}</div>
      </div>
    </div>
  )
}

function FieldRow({ icon, label, value, divider }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: '12px',
      padding: '11px 16px',
      borderTop: divider ? '1px solid #f3f4f6' : 'none'
    }}>
      <div style={{
        width: '28px', height: '28px', borderRadius: '7px',
        background: '#eff9fd', display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0, marginTop: '1px'
      }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: '10px', fontWeight: '700', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '2px' }}>
          {label}
        </div>
        <div style={{ fontSize: '13px', color: '#1a1a1a', fontWeight: '500', lineHeight: '1.4' }}>
          {value || '—'}
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value, color }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      style={{
        backgroundColor: '#fff',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        borderLeft: `4px solid ${color}`
      }}
    >
      <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>{label}</div>
      <div style={{ fontSize: '32px', fontWeight: '800', color: color }}>{value}</div>
    </motion.div>
  )
}

function getRoleColor(role) {
  const colors = {
    citizen: { bg: '#dbeafe', text: '#1e40af' },
    operator: { bg: '#fce7f3', text: '#9f1239' },
    officer: { bg: '#e0e7ff', text: '#3730a3' },
    admin: { bg: '#fef3c7', text: '#92400e' }
  }
  return colors[role] || colors.citizen
}

const tableHeaderStyle = {
  padding: '16px',
  textAlign: 'left',
  fontSize: '12px',
  fontWeight: '700',
  color: '#6b7280',
  textTransform: 'uppercase',
  letterSpacing: '0.05em'
}

const tableCellStyle = {
  padding: '16px',
  fontSize: '14px',
  color: '#1a1a1a'
}
