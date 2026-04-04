import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MdSearch, MdFilterList, MdRemoveRedEye } from 'react-icons/md'
import { motion } from 'framer-motion'
import AdminLayout from './AdminLayout'

const complaints = [
  { id: '#IGMS-2024-9234', title: 'Water Supply Disruption - Ward 12', sector: 'Infrastructure', status: 'Pending', statusColor: '#2596be', statusBg: '#fef0e6', date: '2024-03-28', priority: 'High', assignedTo: 'Unassigned' },
  { id: '#IGMS-2024-9233', title: 'Street Light Not Working - MG Road', sector: 'Public Utilities', status: 'In Progress', statusColor: '#2596be', statusBg: '#e0f2fe', date: '2024-03-28', priority: 'Medium', assignedTo: 'Officer Ramesh' },
  { id: '#IGMS-2024-9232', title: 'Garbage Collection Delay - Block C', sector: 'Sanitation', status: 'Pending', statusColor: '#2596be', statusBg: '#fef0e6', date: '2024-03-27', priority: 'Low', assignedTo: 'Unassigned' },
  { id: '#IGMS-2024-9231', title: 'Road Pothole Repair Request', sector: 'Infrastructure', status: 'Resolved', statusColor: '#10b981', statusBg: '#d1fae5', date: '2024-03-27', priority: 'Medium', assignedTo: 'Officer Priya' },
  { id: '#IGMS-2024-9230', title: 'Noise Pollution Complaint', sector: 'Environment', status: 'In Progress', statusColor: '#2596be', statusBg: '#e0f2fe', date: '2024-03-26', priority: 'Low', assignedTo: 'Officer Kumar' },
  { id: '#IGMS-2024-9229', title: 'Public Park Maintenance', sector: 'Environment', status: 'Escalated', statusColor: '#dc2626', statusBg: '#fee2e2', date: '2024-03-26', priority: 'High', assignedTo: 'Taluk Office' },
]

const sectors = ['All Sectors', 'Infrastructure', 'Public Utilities', 'Sanitation', 'Environment', 'Healthcare', 'Education']
const statuses = ['All Status', 'Pending', 'In Progress', 'Resolved', 'Escalated', 'Rejected']

export default function ComplaintManagement() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [sectorFilter, setSectorFilter] = useState('All Sectors')
  const [statusFilter, setStatusFilter] = useState('All Status')
  const [dateFilter, setDateFilter] = useState('')

  const filtered = complaints.filter(c => {
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase()) || c.id.toLowerCase().includes(search.toLowerCase())
    const matchSector = sectorFilter === 'All Sectors' || c.sector === sectorFilter
    const matchStatus = statusFilter === 'All Status' || c.status === statusFilter
    const matchDate = !dateFilter || c.date === dateFilter
    return matchSearch && matchSector && matchStatus && matchDate
  })

  return (
    <AdminLayout active="complaints">
      
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#1a1a1a', margin: '0 0 8px 0' }}>
          All Complaints
        </h1>
        <p style={{ fontSize: '14px', color: '#666', margin: 0 }}>
          View, filter, assign, and manage all citizen complaints across departments
        </p>
      </div>

      {/* Stats Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '20px',
        marginBottom: '32px'
      }}>
        <StatCard label="Total Complaints" value={complaints.length} color="#2596be" />
        <StatCard label="Pending" value={complaints.filter(c => c.status === 'Pending').length} color="#2596be" />
        <StatCard label="In Progress" value={complaints.filter(c => c.status === 'In Progress').length} color="#2596be" />
        <StatCard label="Resolved" value={complaints.filter(c => c.status === 'Resolved').length} color="#10b981" />
      </div>

      {/* Filters Section */}
      <div style={{
        backgroundColor: '#fff', borderRadius: '12px',
        padding: '24px', marginBottom: '24px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
          <MdFilterList size={20} color="#2596be" />
          <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1a1a1a', margin: 0 }}>
            Filters
          </h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '16px' }}>
          {/* Sector Filter */}
          <div>
            <label style={{ fontSize: '13px', fontWeight: '600', color: '#1a1a1a', marginBottom: '8px', display: 'block' }}>
              Filter by Sector
            </label>
            <select
              value={sectorFilter}
              onChange={e => setSectorFilter(e.target.value)}
              style={{
                width: '100%', padding: '10px 12px', fontSize: '14px',
                border: '1px solid #e5e7eb', borderRadius: '8px',
                backgroundColor: '#fff', outline: 'none',
                fontWeight: '500', cursor: 'pointer',
              }}
            >
              {sectors.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label style={{ fontSize: '13px', fontWeight: '600', color: '#1a1a1a', marginBottom: '8px', display: 'block' }}>
              Filter by Status
            </label>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              style={{
                width: '100%', padding: '10px 12px', fontSize: '14px',
                border: '1px solid #e5e7eb', borderRadius: '8px',
                backgroundColor: '#fff', outline: 'none',
                fontWeight: '500', cursor: 'pointer',
              }}
            >
              {statuses.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {/* Date Filter */}
          <div>
            <label style={{ fontSize: '13px', fontWeight: '600', color: '#1a1a1a', marginBottom: '8px', display: 'block' }}>
              Filter by Date
            </label>
            <input
              type="date"
              value={dateFilter}
              onChange={e => setDateFilter(e.target.value)}
              style={{
                width: '100%', padding: '10px 12px', fontSize: '14px',
                border: '1px solid #e5e7eb', borderRadius: '8px',
                backgroundColor: '#fff', outline: 'none',
                fontWeight: '500', cursor: 'pointer',
              }}
            />
          </div>
        </div>

        {/* Search */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          padding: '12px 16px', borderRadius: '8px',
          backgroundColor: '#f9fafb', border: '1px solid #e5e7eb',
        }}>
          <MdSearch size={20} color="#9ca3af" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by Complaint ID or Title..."
            style={{
              flex: 1, border: 'none', outline: 'none',
              fontSize: '14px', color: '#1a1a1a', backgroundColor: 'transparent',
            }}
          />
        </div>
      </div>

      {/* Complaints List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {filtered.length === 0 ? (
          <div style={{
            backgroundColor: '#fff',
            borderRadius: '12px',
            padding: '60px 20px',
            textAlign: 'center',
            color: '#666',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            No complaints found matching your filters
          </div>
        ) : (
          filtered.map((complaint, i) => (
            <motion.div
              key={complaint.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              style={{
                backgroundColor: '#fff', borderRadius: '12px',
                padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                display: 'flex', alignItems: 'center',
                justifyContent: 'space-between', gap: '16px',
                flexWrap: 'wrap',
              }}
            >
              <div style={{ flex: 1, minWidth: '250px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '12px', fontWeight: '600', color: '#666' }}>
                    {complaint.id}
                  </span>
                  {complaint.priority === 'High' && (
                    <span style={{
                      padding: '3px 10px', borderRadius: '12px',
                      backgroundColor: '#fee2e2', color: '#dc2626',
                      fontSize: '10px', fontWeight: '700',
                    }}>
                      HIGH PRIORITY
                    </span>
                  )}
                  <span style={{ fontSize: '12px', color: '#9ca3af' }}>• {complaint.date}</span>
                </div>
                <p style={{ fontSize: '15px', fontWeight: '600', color: '#1a1a1a', margin: '0 0 8px', lineHeight: 1.4 }}>
                  {complaint.title}
                </p>
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', fontSize: '13px', color: '#666' }}>
                  <span>📍 {complaint.sector}</span>
                  <span>👤 {complaint.assignedTo}</span>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{
                  padding: '6px 16px', borderRadius: '20px',
                  backgroundColor: complaint.statusBg, color: complaint.statusColor,
                  fontSize: '12px', fontWeight: '700',
                }}>
                  {complaint.status}
                </span>
                <button
                  onClick={() => navigate(`/admin/complaint/${complaint.id.split('-').pop()}`)}
                  style={{
                    width: '36px', height: '36px', borderRadius: '8px',
                    border: '1px solid #e5e7eb', backgroundColor: '#f9fafb',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                >
                  <MdRemoveRedEye size={18} color="#2596be" />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Results Count */}
      {filtered.length > 0 && (
        <div style={{ marginTop: '16px', textAlign: 'center', color: '#666', fontSize: '14px' }}>
          Showing {filtered.length} of {complaints.length} complaints
        </div>
      )}

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
