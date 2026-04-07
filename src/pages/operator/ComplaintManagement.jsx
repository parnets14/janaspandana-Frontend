import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MdSearch, MdFilterList, MdRemoveRedEye } from 'react-icons/md'
import { motion } from 'framer-motion'
import OperatorLayout from './OperatorLayout'

const complaints = [
  { id: '#IGMS-2024-9234', title: 'Water Supply Disruption - Ward 12', sector: 'Infrastructure', status: 'Pending', statusColor: '#151A40', statusBg: '#fef0e6', date: '2024-03-28', priority: 'High', assignedTo: 'Unassigned' },
  { id: '#IGMS-2024-9233', title: 'Street Light Not Working - MG Road', sector: 'Public Utilities', status: 'In Progress', statusColor: '#2563eb', statusBg: '#eff6ff', date: '2024-03-28', priority: 'Medium', assignedTo: 'Officer Ramesh' },
  { id: '#IGMS-2024-9232', title: 'Garbage Collection Delay - Block C', sector: 'Sanitation', status: 'Pending', statusColor: '#151A40', statusBg: '#fef0e6', date: '2024-03-27', priority: 'Low', assignedTo: 'Unassigned' },
  { id: '#IGMS-2024-9231', title: 'Road Pothole Repair Request', sector: 'Infrastructure', status: 'Resolved', statusColor: '#41A465', statusBg: '#edf7f1', date: '2024-03-27', priority: 'Medium', assignedTo: 'Officer Priya' },
  { id: '#IGMS-2024-9230', title: 'Noise Pollution Complaint', sector: 'Environment', status: 'In Progress', statusColor: '#2563eb', statusBg: '#eff6ff', date: '2024-03-26', priority: 'Low', assignedTo: 'Officer Kumar' },
  { id: '#IGMS-2024-9229', title: 'Public Park Maintenance', sector: 'Environment', status: 'Escalated', statusColor: '#dc2626', statusBg: '#fef2f2', date: '2024-03-26', priority: 'High', assignedTo: 'Taluk Office' },
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
    <OperatorLayout active="complaints">
      
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '36px', fontWeight: '900', color: '#1a1a1a', margin: '0 0 8px' }}>
          Complaint Management
        </h1>
        <p style={{ fontSize: '16px', color: '#6b5e52', margin: 0 }}>
          View, filter, assign, and manage all citizen complaints across departments.
        </p>
      </div>

      {/* Filters Section */}
      <div style={{
        backgroundColor: '#fff', borderRadius: '20px',
        padding: '24px', border: '1px solid #ede5d8',
        marginBottom: '24px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
          <MdFilterList size={20} color="#41A465" />
          <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1a1a1a', margin: 0 }}>
            Filters
          </h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '16px' }}>
          {/* Sector Filter */}
          <div>
            <label style={{ fontSize: '13px', fontWeight: '600', color: '#3a3a3a', marginBottom: '8px', display: 'block' }}>
              Filter by Sector
            </label>
            <select
              value={sectorFilter}
              onChange={e => setSectorFilter(e.target.value)}
              style={{
                width: '100%', padding: '12px 14px', fontSize: '14px',
                border: '1.5px solid #e0d5c8', borderRadius: '10px',
                backgroundColor: '#faf6f0', outline: 'none',
                fontWeight: '600', cursor: 'pointer',
              }}
            >
              {sectors.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label style={{ fontSize: '13px', fontWeight: '600', color: '#3a3a3a', marginBottom: '8px', display: 'block' }}>
              Filter by Status
            </label>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              style={{
                width: '100%', padding: '12px 14px', fontSize: '14px',
                border: '1.5px solid #e0d5c8', borderRadius: '10px',
                backgroundColor: '#faf6f0', outline: 'none',
                fontWeight: '600', cursor: 'pointer',
              }}
            >
              {statuses.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {/* Date Filter */}
          <div>
            <label style={{ fontSize: '13px', fontWeight: '600', color: '#3a3a3a', marginBottom: '8px', display: 'block' }}>
              Filter by Date
            </label>
            <input
              type="date"
              value={dateFilter}
              onChange={e => setDateFilter(e.target.value)}
              style={{
                width: '100%', padding: '12px 14px', fontSize: '14px',
                border: '1.5px solid #e0d5c8', borderRadius: '10px',
                backgroundColor: '#faf6f0', outline: 'none',
                fontWeight: '600', cursor: 'pointer',
              }}
            />
          </div>
        </div>

        {/* Search */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          padding: '12px 18px', borderRadius: '12px',
          backgroundColor: '#faf6f0', border: '1.5px solid #e0d5c8',
        }}>
          <MdSearch size={18} color="#9e8e80" />
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
        {filtered.map((complaint, i) => (
          <motion.div
            key={complaint.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            style={{
              backgroundColor: '#fff', borderRadius: '16px',
              padding: '20px', border: '1px solid #ede5d8',
              display: 'flex', alignItems: 'center',
              justifyContent: 'space-between', gap: '16px',
              flexWrap: 'wrap',
            }}
          >
            <div style={{ flex: 1, minWidth: '250px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '12px', fontWeight: '600', color: '#9e8e80' }}>
                  {complaint.id}
                </span>
                {complaint.priority === 'High' && (
                  <span style={{
                    padding: '3px 10px', borderRadius: '999px',
                    backgroundColor: '#fef0e6', color: '#151A40',
                    fontSize: '10px', fontWeight: '800',
                  }}>
                    HIGH
                  </span>
                )}
                <span style={{ fontSize: '12px', color: '#9e8e80' }}>• {complaint.time}</span>
              </div>
              <p style={{ fontSize: '15px', fontWeight: '700', color: '#1a1a1a', margin: '0 0 8px', lineHeight: 1.3 }}>
                {complaint.title}
              </p>
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '13px', color: '#6b5e52' }}>
                  📍 {complaint.sector}
                </span>
                <span style={{ fontSize: '13px', color: '#6b5e52' }}>
                  👤 {complaint.assignedTo}
                </span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{
                padding: '6px 16px', borderRadius: '999px',
                backgroundColor: complaint.statusBg, color: complaint.statusColor,
                fontSize: '12px', fontWeight: '700',
              }}>
                {complaint.status}
              </span>
              <button
                onClick={() => navigate(`/operator/complaint/${complaint.id.split('-').pop()}`)}
                style={{
                  width: '36px', height: '36px', borderRadius: '10px',
                  border: '1px solid #e0d5c8', backgroundColor: '#faf6f0',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                <MdRemoveRedEye size={18} color="#41A465" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

    </OperatorLayout>
  )
}
