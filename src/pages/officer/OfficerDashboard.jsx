import { useNavigate } from 'react-router-dom'
import { MdSearch, MdAdd, MdRemoveRedEye } from 'react-icons/md'
import { HiCheckCircle } from 'react-icons/hi2'
import { useState } from 'react'
import OfficerLayout from './OfficerLayout'

const tasks = [
  { id: '#IGMS-2024-8842', title: 'Public Infrastructure Damage: Main Street Water Main Leakage causing local flooding.', status: 'In Progress', statusColor: '#2563eb', statusBg: '#eff6ff', priority: 'HIGH PRIORITY', created: '2h ago' },
  { id: '#IGMS-2024-7719', title: 'Street Lighting Malfunction - Sector 4', status: 'Resolved', statusColor: '#41A465', statusBg: '#edf7f1', priority: null, created: null },
  { id: '#IGMS-2024-8021', title: 'Uncollected Waste Report - Emerald Heights', status: 'Pending', statusColor: '#2596be', statusBg: '#fef0e6', priority: null, created: null },
  { id: '#IGMS-2024-8110', title: 'Noise Complaint: Industrial Zone Violation', status: 'In Progress', statusColor: '#2563eb', statusBg: '#eff6ff', priority: null, created: null },
]

const filters = ['All Tasks', 'Pending', 'In Progress', 'Resolved']

export default function OfficerDashboard() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [activeFilter, setActiveFilter] = useState('All Tasks')

  const filtered = tasks.filter(t => {
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase()) || t.id.toLowerCase().includes(search.toLowerCase())
    const matchFilter = activeFilter === 'All Tasks' || t.status === activeFilter
    return matchSearch && matchFilter
  })

  return (
    <OfficerLayout active="dashboard">
      <div className="officer-grid">

        {/* Left — main content */}
        <div>
          {/* Header */}
          <div style={{ marginBottom: '32px' }}>
            <h1 style={{ fontSize: '36px', fontWeight: '900', color: '#1a1a1a', margin: '0 0 8px' }}>Assigned Complaints</h1>
            <p style={{ fontSize: '16px', color: '#6b5e52', margin: 0 }}>
              Review and manage active grievances under your jurisdiction. Prioritize urgent resolutions to maintain departmental efficiency.
            </p>
          </div>

          {/* Search + Filters */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 18px', borderRadius: '12px', backgroundColor: '#fff', border: '1.5px solid #e0d5c8', flex: 1, minWidth: '200px', maxWidth: '360px' }}>
              <MdSearch size={18} color="#9e8e80" />
              <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search by Complaint ID or Title..."
                style={{ flex: 1, border: 'none', outline: 'none', fontSize: '14px', color: '#1a1a1a', backgroundColor: 'transparent' }}
              />
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {filters.map(f => (
                <button key={f} onClick={() => setActiveFilter(f)} style={{
                  padding: '9px 18px', borderRadius: '999px', border: '1.5px solid',
                  borderColor: activeFilter === f ? '#2596be' : '#e0d5c8',
                  backgroundColor: activeFilter === f ? '#2596be' : '#fff',
                  color: activeFilter === f ? '#fff' : '#555',
                  fontSize: '13px', fontWeight: '700', cursor: 'pointer', whiteSpace: 'nowrap',
                }}>
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Featured card */}
          {filtered[0] && filtered[0].priority && (
            <div style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '28px', border: '1px solid #ede5d8', marginBottom: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <span style={{ padding: '4px 12px', borderRadius: '999px', backgroundColor: '#fef0e6', color: '#2596be', fontSize: '11px', fontWeight: '800', letterSpacing: '0.5px' }}>
                    HIGH PRIORITY
                  </span>
                  <span style={{ fontSize: '13px', color: '#9e8e80' }}>Created {filtered[0].created}</span>
                </div>
                <span style={{ padding: '5px 14px', borderRadius: '999px', backgroundColor: filtered[0].statusBg, color: filtered[0].statusColor, fontSize: '12px', fontWeight: '700' }}>
                  {filtered[0].status}
                </span>
              </div>
              <p style={{ fontSize: '11px', fontWeight: '600', color: '#9e8e80', margin: '0 0 6px', letterSpacing: '0.5px' }}>{filtered[0].id}</p>
              <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#1a1a1a', margin: '0 0 10px', lineHeight: 1.3 }}>Grievance {filtered[0].id}</h3>
              <p style={{ fontSize: '14px', color: '#6b5e52', margin: '0 0 20px', lineHeight: 1.6 }}>{filtered[0].title}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', gap: '-8px' }}>
                  {['#2596be', '#41A465', '#2563eb'].map((c, i) => (
                    <div key={i} style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: c, border: '2px solid #fff', marginLeft: i > 0 ? '-8px' : 0 }} />
                  ))}
                </div>
                <button onClick={() => navigate('/officer/case/8842')} style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '10px 22px', borderRadius: '10px',
                  backgroundColor: '#2596be', color: '#fff', border: 'none',
                  fontSize: '14px', fontWeight: '700', cursor: 'pointer',
                }}>
                  View Details →
                </button>
              </div>
            </div>
          )}

          {/* Other tasks */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filtered.filter(t => !t.priority).map(t => (
              <div key={t.id} style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '20px', border: '1px solid #ede5d8', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <p style={{ fontSize: '12px', fontWeight: '600', color: '#9e8e80', margin: '0 0 4px' }}>{t.id}</p>
                  <p style={{ fontSize: '15px', fontWeight: '700', color: '#1a1a1a', margin: 0, lineHeight: 1.3 }}>{t.title}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ padding: '5px 14px', borderRadius: '999px', backgroundColor: t.statusBg, color: t.statusColor, fontSize: '12px', fontWeight: '700' }}>
                    {t.status}
                  </span>
                  <button onClick={() => navigate('/officer/case/8842')} style={{ width: '36px', height: '36px', borderRadius: '10px', border: '1px solid #e0d5c8', backgroundColor: '#faf6f0', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                    <MdRemoveRedEye size={18} color="#2596be" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right — stats panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Resolution rate card */}
          <div style={{ backgroundColor: '#2596be', borderRadius: '20px', padding: '28px' }}>
            <p style={{ fontSize: '13px', fontWeight: '600', color: 'rgba(255,255,255,0.8)', margin: '0 0 8px', letterSpacing: '0.5px' }}>Weekly Resolution Rate</p>
            <p style={{ fontSize: '56px', fontWeight: '900', color: '#fff', margin: '0 0 8px', lineHeight: 1 }}>92%</p>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)', margin: '0 0 20px', lineHeight: 1.6 }}>
              You have resolved 24 tasks this week. Keep up the momentum to reach the departmental goal.
            </p>
            <button style={{ width: '100%', padding: '12px', borderRadius: '10px', backgroundColor: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)', color: '#fff', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
              View Analytics
            </button>
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {[
              { label: 'Total Assigned', value: '28', color: '#1a1a1a' },
              { label: 'In Progress', value: '04', color: '#2563eb' },
              { label: 'Resolved', value: '24', color: '#41A465' },
              { label: 'Pending', value: '02', color: '#2596be' },
            ].map(s => (
              <div key={s.label} style={{ backgroundColor: '#fff', borderRadius: '14px', padding: '18px', border: '1px solid #ede5d8' }}>
                <p style={{ fontSize: '28px', fontWeight: '900', color: s.color, margin: '0 0 4px', lineHeight: 1 }}>{s.value}</p>
                <p style={{ fontSize: '12px', color: '#6b5e52', margin: 0 }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </OfficerLayout>
  )
}
