import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  MdSearch, 
  MdFilterList, 
  MdPerson,
  MdPhone,
  MdLocationOn,
  MdVerified,
  MdBlock,
  MdMoreVert
} from 'react-icons/md'
import AdminLayout from './AdminLayout'
import api from '../../utils/secureApi'

export default function UserManagement() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRole, setFilterRole] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await api.get('/auth/users')
      if (response.data.success) {
        setUsers(response.data.data)
      }
    } catch (error) {
      console.error('Failed to fetch users')
    } finally {
      setLoading(false)
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
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#1a1a1a', margin: '0 0 8px 0' }}>
            User Management
          </h1>
          <p style={{ color: '#666', margin: 0 }}>
            Manage all registered users in the system
          </p>
        </div>

        {/* Stats Cards */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '20px',
          marginBottom: '32px'
        }}>
          <StatCard label="Total Users" value={stats.total} color="#2596be" />
          <StatCard label="Active Users" value={stats.active} color="#10b981" />
          <StatCard label="Verified" value={stats.verified} color="#8b5cf6" />
          <StatCard label="Citizens" value={stats.citizens} color="#f59e0b" />
          <StatCard label="Operators" value={stats.operators} color="#ec4899" />
          <StatCard label="Officers" value={stats.officers} color="#6366f1" />
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

            {/* Role Filter */}
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#1a1a1a' }}>
                Filter by Role
              </label>
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="all">All Roles</option>
                <option value="citizen">Citizens</option>
                <option value="operator">Operators</option>
                <option value="officer">Officers</option>
                <option value="admin">Admins</option>
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#1a1a1a' }}>
                Filter by Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
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
                    <th style={tableHeaderStyle}>Status</th>
                    <th style={tableHeaderStyle}>Verified</th>
                    <th style={tableHeaderStyle}>Registered</th>
                    <th style={tableHeaderStyle}>Last Login</th>
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
                        <span style={{
                          padding: '4px 12px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: '600',
                          backgroundColor: user.isActive ? '#d1fae5' : '#fee2e2',
                          color: user.isActive ? '#065f46' : '#991b1b'
                        }}>
                          {user.isActive ? 'Active' : 'Inactive'}
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
    </AdminLayout>
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
