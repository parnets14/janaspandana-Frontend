import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MdArrowForward, MdUpload, MdLocationOn, MdEdit, MdAgriculture, MdSchool, MdLocalHospital, MdLocalPolice, MdAccountBalance, MdConstruction, MdWaterDrop, MdDelete, MdPark, MdTitle, MdDescription } from 'react-icons/md'
import { RiGovernmentLine } from 'react-icons/ri'
import UserLayout from './UserLayout'

const departments = [
  { name: 'Agriculture', icon: MdAgriculture },
  { name: 'Education', icon: MdSchool },
  { name: 'Healthcare', icon: MdLocalHospital },
  { name: 'Police', icon: MdLocalPolice },
  { name: 'Revenue', icon: MdAccountBalance },
  { name: 'Infrastructure', icon: MdConstruction },
  { name: 'Public Utilities', icon: MdWaterDrop },
  { name: 'Sanitation', icon: MdDelete },
  { name: 'Environment', icon: MdPark },
]

export default function SubmitComplaint() {
  const navigate = useNavigate()
  const [dept, setDept] = useState('Agriculture')
  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    alert('Complaint submitted successfully!')
    navigate('/user/complaints')
  }

  return (
    <UserLayout active="complaints">
      <div style={{ maxWidth: '860px' }}>

        {/* Page title */}
        <div style={{ marginBottom: '36px' }}>
          <h1 style={{ fontSize: 'clamp(24px, 5vw, 36px)', fontWeight: '900', color: '#1a1a1a', margin: '0 0 10px', lineHeight: 1.2 }}>
            New Resolution
          </h1>
          <p style={{ fontSize: 'clamp(14px, 2.5vw, 16px)', color: '#6b5e52', margin: 0, lineHeight: 1.6 }}>
            Share your concern with us. Our concierge team is here to ensure transparency and accountability.
          </p>
        </div>

        <div className="submit-form-card" style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '40px', border: '1px solid #ede5d8', boxShadow: '0 4px 24px rgba(0,0,0,0.05)' }}>
          <form onSubmit={handleSubmit}>

            {/* Department */}
            <div style={{ marginBottom: '32px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '15px', fontWeight: '700', color: '#1a1a1a', marginBottom: '14px' }}>
                <RiGovernmentLine size={18} color="#2596be" /> Select Department
              </label>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {departments.map(d => {
                  const Icon = d.icon
                  return (
                    <button key={d.name} type="button" onClick={() => setDept(d.name)} style={{
                      padding: '9px 16px', borderRadius: '999px', border: '1.5px solid',
                      borderColor: dept === d.name ? '#2596be' : '#e0d5c8',
                      backgroundColor: dept === d.name ? '#2596be' : '#fff',
                      color: dept === d.name ? '#fff' : '#555',
                      fontSize: '14px', fontWeight: '600', cursor: 'pointer',
                      transition: 'all 0.15s',
                      display: 'flex', alignItems: 'center', gap: '6px',
                    }}>
                      <Icon size={16} />
                      {d.name}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Two column: title + description */}
            <div className="submit-two-col">
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '15px', fontWeight: '700', color: '#1a1a1a', marginBottom: '10px' }}>
                  <MdTitle size={18} color="#2596be" /> Complaint Title
                </label>
                <input
                  type="text" value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="Brief summary of the issue"
                  required
                  style={{
                    width: '100%', padding: '14px 16px', borderRadius: '12px',
                    border: '1.5px solid #e0d5c8', backgroundColor: '#faf6f0',
                    fontSize: '14px', color: '#1a1a1a', outline: 'none', boxSizing: 'border-box',
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '15px', fontWeight: '700', color: '#1a1a1a', marginBottom: '10px' }}>
                  <MdDescription size={18} color="#2596be" /> Detailed Description
                </label>
                <textarea
                  value={desc}
                  onChange={e => setDesc(e.target.value)}
                  placeholder="Provide as much detail as possible to help our investigators..."
                  rows={4}
                  required
                  style={{
                    width: '100%', padding: '14px 16px', borderRadius: '12px',
                    border: '1.5px solid #e0d5c8', backgroundColor: '#faf6f0',
                    fontSize: '14px', color: '#1a1a1a', outline: 'none',
                    resize: 'none', boxSizing: 'border-box', lineHeight: 1.6,
                  }}
                />
              </div>
            </div>

            {/* Upload + GPS + Location row */}
            <div className="submit-three-col">
              <button type="button" style={{
                padding: '28px 16px', borderRadius: '14px',
                border: '1.5px dashed #e0d5c8', backgroundColor: '#faf6f0',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px',
                cursor: 'pointer',
              }}>
                <MdUpload size={32} color="#2596be" />
                <span style={{ fontSize: '12px', fontWeight: '700', color: '#555', letterSpacing: '0.5px' }}>UPLOAD PROOF</span>
              </button>

              <button type="button" style={{
                padding: '28px 16px', borderRadius: '14px',
                border: '1.5px dashed #e0d5c8', backgroundColor: '#faf6f0',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px',
                cursor: 'pointer',
              }}>
                <MdLocationOn size={32} color="#2563eb" />
                <span style={{ fontSize: '12px', fontWeight: '700', color: '#555', letterSpacing: '0.5px' }}>GPS DETECT</span>
              </button>

              <div style={{
                display: 'flex', alignItems: 'center', gap: '14px',
                padding: '20px', borderRadius: '14px',
                backgroundColor: '#fff', border: '1px solid #ede5d8',
              }}>
                <div style={{
                  width: '52px', height: '52px', borderRadius: '12px', flexShrink: 0,
                  background: 'linear-gradient(135deg, #c8b89a 0%, #a89070 100%)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <MdLocationOn size={26} color="#fff" />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '10px', fontWeight: '700', color: '#9e8e80', letterSpacing: '1px', margin: '0 0 4px' }}>CURRENT LOCATION</p>
                  <p style={{ fontSize: '15px', fontWeight: '600', color: '#1a1a1a', margin: 0 }}>Sector 12, Janakpuri, Delhi</p>
                </div>
                <MdEdit size={20} color="#2596be" style={{ cursor: 'pointer', flexShrink: 0 }} />
              </div>
            </div>

            {/* Submit */}
            <div className="submit-footer" style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
              <button type="submit" style={{
                padding: '15px 40px', borderRadius: '14px',
                backgroundColor: '#2596be', color: '#fff', border: 'none',
                fontSize: '16px', fontWeight: '700', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '8px',
                boxShadow: '0 4px 14px rgba(231,83,0,0.3)',
              }}>
                Submit Grievance <MdArrowForward size={20} />
              </button>
              <p style={{ fontSize: '13px', color: '#9e8e80', lineHeight: 1.6, margin: 0, flex: '1 1 200px' }}>
                By submitting, you agree to our Terms of Accountability and Truthful Reporting.
              </p>
            </div>

          </form>
        </div>
      </div>
    </UserLayout>
  )
}
