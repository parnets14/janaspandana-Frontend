import { useState } from 'react'
import { MdSearch, MdTrendingUp, MdPending, MdCheckCircle, MdWarning } from 'react-icons/md'
import { motion } from 'framer-motion'
import OperatorLayout from './OperatorLayout'

const stats = [
  { label: 'Total Complaints', value: '156', icon: <MdTrendingUp size={24} />, color: '#1a1a1a', bg: '#f0f0ee' },
  { label: 'Pending', value: '24', icon: <MdPending size={24} />, color: '#2596be', bg: '#fef0e6' },
  { label: 'In Progress', value: '48', icon: <MdTrendingUp size={24} />, color: '#2563eb', bg: '#eff6ff' },
  { label: 'Resolved', value: '78', icon: <MdCheckCircle size={24} />, color: '#41A465', bg: '#edf7f1' },
  { label: 'Escalated', value: '06', icon: <MdWarning size={24} />, color: '#dc2626', bg: '#fef2f2' },
]

const recentComplaints = [
  { id: '#IGMS-2024-9234', title: 'Water Supply Disruption - Ward 12', sector: 'Infrastructure', status: 'Pending', statusColor: '#2596be', statusBg: '#fef0e6', time: '15 mins ago', priority: 'High' },
  { id: '#IGMS-2024-9233', title: 'Street Light Not Working - MG Road', sector: 'Public Utilities', status: 'In Progress', statusColor: '#2563eb', statusBg: '#eff6ff', time: '1 hour ago', priority: 'Medium' },
  { id: '#IGMS-2024-9232', title: 'Garbage Collection Delay', sector: 'Sanitation', status: 'Pending', statusColor: '#2596be', statusBg: '#fef0e6', time: '2 hours ago', priority: 'Low' },
  { id: '#IGMS-2024-9231', title: 'Road Pothole Repair Request', sector: 'Infrastructure', status: 'Resolved', statusColor: '#41A465', statusBg: '#edf7f1', time: '3 hours ago', priority: 'Medium' },
]

export default function OperatorDashboard() {
  const [search, setSearch] = useState('')

  const filtered = recentComplaints.filter(c => 
    c.title.toLowerCase().includes(search.toLowerCase()) || 
    c.id.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <OperatorLayout active="dashboard">
      
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '36px', fontWeight: '900', color: '#1a1a1a', margin: '0 0 8px' }}>
          Operator Dashboard
        </h1>
        <p style={{ fontSize: '16px', color: '#6b5e52', margin: 0 }}>
          Monitor and manage all grievances across departments. Assign tasks and track resolution progress.
        </p>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            style={{
              backgroundColor: '#fff', borderRadius: '16px',
              padding: '24px', border: '1px solid #ede5d8',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <div>
                <p style={{ fontSize: '36px', fontWeight: '900', color: stat.color, margin: '0 0 4px', lineHeight: 1 }}>
                  {stat.value}
                </p>
                <p style={{ fontSize: '13px', fontWeight: '600', color: '#6b5e52', margin: 0 }}>
                  {stat.label}
                </p>
              </div>
              <div style={{
                width: '48px', height: '48px', borderRadius: '12px',
                backgroundColor: stat.bg, display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                color: stat.color,
              }}>
                {stat.icon}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent Complaints Section */}
      <div style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '28px', border: '1px solid #ede5d8' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#1a1a1a', margin: 0 }}>
            Recent Complaints
          </h2>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '10px 16px', borderRadius: '12px',
            backgroundColor: '#faf6f0', border: '1.5px solid #e0d5c8',
            minWidth: '280px',
          }}>
            <MdSearch size={18} color="#9e8e80" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search complaints..."
              style={{
                flex: 1, border: 'none', outline: 'none',
                fontSize: '14px', color: '#1a1a1a', backgroundColor: 'transparent',
              }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filtered.map((complaint, i) => (
            <motion.div
              key={complaint.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              style={{
                padding: '20px', borderRadius: '14px',
                backgroundColor: '#faf6f0', border: '1px solid #ede5d8',
                cursor: 'pointer',
              }}
              whileHover={{ backgroundColor: '#f5f1e8', transition: { duration: 0.2 } }}
              onClick={() => {}}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px', gap: '16px', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '12px', fontWeight: '600', color: '#9e8e80' }}>
                      {complaint.id}
                    </span>
                    {complaint.priority === 'High' && (
                      <span style={{
                        padding: '3px 10px', borderRadius: '999px',
                        backgroundColor: '#fef0e6', color: '#2596be',
                        fontSize: '10px', fontWeight: '800', letterSpacing: '0.5px',
                      }}>
                        HIGH PRIORITY
                      </span>
                    )}
                    <span style={{ fontSize: '12px', color: '#9e8e80' }}>• {complaint.time}</span>
                  </div>
                  <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1a1a1a', margin: '0 0 8px', lineHeight: 1.3 }}>
                    {complaint.title}
                  </h3>
                  <span style={{ fontSize: '13px', color: '#6b5e52', fontWeight: '600' }}>
                    📍 {complaint.sector}
                  </span>
                </div>
                <span style={{
                  padding: '6px 16px', borderRadius: '999px',
                  backgroundColor: complaint.statusBg, color: complaint.statusColor,
                  fontSize: '12px', fontWeight: '700', whiteSpace: 'nowrap',
                }}>
                  {complaint.status}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

    </OperatorLayout>
  )
}
