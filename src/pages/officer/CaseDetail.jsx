import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MdArrowBack, MdLocationOn, MdCameraAlt, MdCheckCircle, MdArrowForward } from 'react-icons/md'
import { HiCheckCircle } from 'react-icons/hi2'
import { BsCircleFill } from 'react-icons/bs'
import OfficerLayout from './OfficerLayout'

const timeline = [
  { label: 'Case Assigned to Officer', time: 'Today, 09:00 AM', done: true },
  { label: 'Grievance Filed by Citizen', time: 'Today, 07:45 AM', done: true },
]

export default function CaseDetail() {
  const navigate = useNavigate()
  const [status, setStatus] = useState('In Progress')
  const [remarks, setRemarks] = useState('')

  return (
    <OfficerLayout active="dashboard">
      {/* Back */}
      <button onClick={() => navigate('/officer/dashboard')} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', color: '#6b5e52', fontSize: '14px', cursor: 'pointer', marginBottom: '28px', padding: 0 }}>
        <MdArrowBack size={16} /> Back to task queue
      </button>

      <div className="case-grid">

        {/* Left — case info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Case header */}
          <div style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '28px', border: '1px solid #ede5d8' }}>
            <p style={{ fontSize: '12px', fontWeight: '600', color: '#9e8e80', margin: '0 0 8px', letterSpacing: '0.5px' }}>CASE #IGMS-8842</p>
            <h1 style={{ fontSize: '28px', fontWeight: '900', color: '#1a1a1a', margin: '0 0 14px', lineHeight: 1.2 }}>
              Broken Water Main on 5th Ave
            </h1>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 14px', borderRadius: '999px', backgroundColor: '#eff6ff', color: '#2563eb', fontSize: '13px', fontWeight: '700', marginBottom: '20px' }}>
              <BsCircleFill size={8} /> In Progress
            </span>
            <p style={{ fontSize: '15px', color: '#6b5e52', lineHeight: 1.7, margin: 0 }}>
              A significant water main break has caused flooding near the central library entrance. The pavement is beginning to crack, and water pressure in nearby residential buildings has dropped significantly. Citizen reports this started approximately 2 hours ago.
            </p>
          </div>

          {/* Images */}
          <div style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '28px', border: '1px solid #ede5d8' }}>
            <p style={{ fontSize: '15px', fontWeight: '700', color: '#1a1a1a', margin: '0 0 16px' }}>Citizen Uploads</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {['Citizen Upload 1', 'Citizen Upload 2'].map((label, i) => (
                <div key={i} style={{ borderRadius: '14px', overflow: 'hidden', backgroundColor: '#f0e8dc', aspectRatio: '16/9', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                  <div style={{ background: `linear-gradient(135deg, ${i === 0 ? '#c8b89a, #8a7060' : '#a0b8c8, #607080'})`, width: '100%', height: '100%', display: 'flex', alignItems: 'flex-end', padding: '12px' }}>
                    <span style={{ fontSize: '12px', fontWeight: '600', color: '#fff', backgroundColor: 'rgba(0,0,0,0.4)', padding: '4px 10px', borderRadius: '6px' }}>{label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Location */}
          <div style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '28px', border: '1px solid #ede5d8' }}>
            <div style={{ borderRadius: '14px', backgroundColor: '#e8f0e8', height: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #b8d4b8 0%, #88b888 100%)' }} />
              <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
                <MdLocationOn size={40} color="#2596be" />
              </div>
            </div>
            <p style={{ fontSize: '15px', fontWeight: '700', color: '#1a1a1a', margin: '0 0 4px' }}>Location: 5th Avenue &amp; E 42nd St</p>
            <p style={{ fontSize: '13px', color: '#9e8e80', margin: '0 0 12px' }}>Coordinates: -40.7527° N, 73.9772° W</p>
            <a href="#" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#41A465', fontSize: '13px', fontWeight: '600', textDecoration: 'none' }}>
              <MdLocationOn size={15} /> Open in Navigate
            </a>
          </div>
        </div>

        {/* Right — action panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Resolution Action */}
          <div style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '28px', border: '1px solid #ede5d8' }}>
            <p style={{ fontSize: '16px', fontWeight: '800', color: '#1a1a1a', margin: '0 0 20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              ⚡ Resolution Action
            </p>

            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#3a3a3a', marginBottom: '8px' }}>
              Update Resolution Status
            </label>
            <select value={status} onChange={e => setStatus(e.target.value)} style={{
              width: '100%', padding: '12px 16px', borderRadius: '12px',
              border: '1.5px solid #e0d5c8', backgroundColor: '#faf6f0',
              fontSize: '14px', color: '#1a1a1a', outline: 'none',
              marginBottom: '20px', cursor: 'pointer',
            }}>
              <option>Pending</option>
              <option>In Progress</option>
              <option>Resolved</option>
            </select>

            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#3a3a3a', marginBottom: '8px' }}>
              Officer Remarks &amp; Logs
            </label>
            <textarea value={remarks} onChange={e => setRemarks(e.target.value)}
              placeholder="Describe current progress, team members on-site, or expected completion time..."
              rows={4}
              style={{
                width: '100%', padding: '12px 16px', borderRadius: '12px',
                border: '1.5px solid #e0d5c8', backgroundColor: '#faf6f0',
                fontSize: '14px', color: '#1a1a1a', outline: 'none',
                resize: 'none', boxSizing: 'border-box', lineHeight: 1.6, marginBottom: '20px',
              }}
            />

            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#3a3a3a', marginBottom: '12px' }}>
              Officer Proof (Before/After)
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '24px' }}>
              {[
                { label: 'BEFORE WORK', icon: <MdCameraAlt size={24} color="#9e8e80" />, done: false },
                { label: 'AFTER WORK', icon: <MdCheckCircle size={24} color="#41A465" />, done: true },
              ].map(item => (
                <button key={item.label} type="button" style={{
                  padding: '20px 12px', borderRadius: '12px',
                  border: `1.5px ${item.done ? 'solid #41A465' : 'dashed #e0d5c8'}`,
                  backgroundColor: item.done ? '#edf7f1' : '#faf6f0',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', cursor: 'pointer',
                }}>
                  {item.icon}
                  <span style={{ fontSize: '11px', fontWeight: '700', color: item.done ? '#41A465' : '#9e8e80', letterSpacing: '0.5px' }}>{item.label}</span>
                </button>
              ))}
            </div>

            <button style={{
              width: '100%', padding: '14px', borderRadius: '12px',
              backgroundColor: '#2596be', color: '#fff', border: 'none',
              fontSize: '15px', fontWeight: '700', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              boxShadow: '0 4px 14px rgba(231,83,0,0.3)',
            }}>
              ▶ Submit Update
            </button>
          </div>

          {/* Task History */}
          <div style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '28px', border: '1px solid #ede5d8' }}>
            <p style={{ fontSize: '15px', fontWeight: '700', color: '#1a1a1a', margin: '0 0 16px' }}>Task History</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {timeline.map((t, i) => (
                <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <HiCheckCircle size={18} color="#41A465" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <p style={{ fontSize: '13px', fontWeight: '600', color: '#1a1a1a', margin: '0 0 2px' }}>{t.label}</p>
                    <p style={{ fontSize: '12px', color: '#9e8e80', margin: 0 }}>{t.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </OfficerLayout>
  )
}
