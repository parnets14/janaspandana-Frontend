import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MdSearch, MdAdd } from 'react-icons/md'
import { RiBuilding2Line } from 'react-icons/ri'
import { BsCalendar3 } from 'react-icons/bs'
import UserLayout from './UserLayout'

const complaints = [
  {
    id: '#IGMS-8821', title: 'Street Light Malfunction at Sector 4',
    dept: 'Public Utilities', date: 'Oct 12, 2023',
    status: 'RESOLVED', statusColor: '#41A465', statusBg: '#edf7f1',
    progress: null,
  },
  {
    id: '#IGMS-9045', title: 'Garbage Collection Delay - Block C',
    dept: 'Sanitation', date: 'Oct 24, 2023',
    status: 'IN PROGRESS', statusColor: '#2563eb', statusBg: '#eff6ff',
    progress: 60,
  },
  {
    id: '#IGMS-9102', title: 'Water Pipe Leakage Main Road',
    dept: 'Infrastructure', date: 'Yesterday',
    status: 'PENDING', statusColor: '#2596be', statusBg: '#fef0e6',
    progress: null,
  },
  {
    id: '#IGMS-8700', title: 'Park Maintenance Request',
    dept: 'Environment', date: 'Sep 30, 2023',
    status: 'RESOLVED', statusColor: '#41A465', statusBg: '#edf7f1',
    progress: null,
  },
]

const filters = ['ALL', 'PENDING', 'IN PROGRESS', 'RESOLVED', 'REJECTED']

export default function MyComplaints() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [activeFilter, setActiveFilter] = useState('ALL')

  const filtered = complaints.filter(c => {
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase()) || c.id.toLowerCase().includes(search.toLowerCase())
    const matchFilter = activeFilter === 'ALL' || c.status === activeFilter
    return matchSearch && matchFilter
  })

  return (
    <UserLayout active="complaints">

      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '36px', fontWeight: '900', color: '#1a1a1a', margin: '0 0 8px' }}>My Complaints</h1>
          <p style={{ fontSize: '16px', color: '#6b5e52', margin: 0 }}>Tracking your requests for resolution and progress updates.</p>
        </div>
        <button
          onClick={() => navigate('/user/submit')}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '12px 24px', borderRadius: '12px',
            backgroundColor: '#2596be', color: '#fff', border: 'none',
            fontSize: '15px', fontWeight: '700', cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(231,83,0,0.3)',
          }}
        >
          <MdAdd size={20} /> New Complaint
        </button>
      </div>

      {/* Search + Filters */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '28px', flexWrap: 'wrap' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          padding: '12px 18px', borderRadius: '12px',
          backgroundColor: '#fff', border: '1.5px solid #e0d5c8',
          flex: '1', minWidth: '240px', maxWidth: '360px',
        }}>
          <MdSearch size={18} color="#9e8e80" />
          <input
            type="text" value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by ID or title..."
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

      {/* Complaint Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
        {filtered.map(c => (
          <div key={c.id} 
            onClick={() => navigate(`/user/complaint/${c.id.split('-')[1]}`)}
            style={{
            backgroundColor: '#fff', borderRadius: '16px',
            padding: '22px', border: '1px solid #ede5d8',
            cursor: 'pointer', transition: 'box-shadow 0.2s',
          }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)'}
            onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
              <span style={{ fontSize: '12px', fontWeight: '600', color: '#9e8e80' }}>{c.id}</span>
              <span style={{
                padding: '4px 12px', borderRadius: '999px',
                backgroundColor: c.statusBg, color: c.statusColor,
                fontSize: '11px', fontWeight: '700', letterSpacing: '0.3px',
              }}>
                {c.status}
              </span>
            </div>

            <p style={{ fontSize: '17px', fontWeight: '800', color: '#1a1a1a', margin: '0 0 14px', lineHeight: 1.3 }}>
              {c.title}
            </p>

            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#6b5e52' }}>
                <RiBuilding2Line size={14} color="#9e8e80" /> {c.dept}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#6b5e52' }}>
                <BsCalendar3 size={13} color="#9e8e80" /> {c.date}
              </span>
            </div>

            {c.progress !== null && (
              <div style={{ marginTop: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '12px', color: '#6b5e52' }}>Progress</span>
                  <span style={{ fontSize: '12px', fontWeight: '700', color: '#2563eb' }}>{c.progress}%</span>
                </div>
                <div style={{ height: '5px', borderRadius: '999px', backgroundColor: '#e0d5c8', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${c.progress}%`, backgroundColor: '#2563eb', borderRadius: '999px' }} />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

    </UserLayout>
  )
}
