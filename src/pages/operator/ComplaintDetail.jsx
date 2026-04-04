import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { MdArrowBack, MdLocationOn, MdPerson, MdPhone, MdEmail, MdUpload, MdSend } from 'react-icons/md'
import { motion } from 'framer-motion'
import OperatorLayout from './OperatorLayout'

export default function ComplaintDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [status, setStatus] = useState('Pending')
  const [remarks, setRemarks] = useState('')
  const [assignTo, setAssignTo] = useState('')
  const [proofFile, setProofFile] = useState(null)

  const complaint = {
    id: `#IGMS-2024-${id}`,
    title: 'Water Supply Disruption - Ward 12',
    description: 'There has been no water supply in our area for the past 3 days. Multiple households are affected. We request immediate action to restore the water supply.',
    sector: 'Infrastructure',
    status: 'Pending',
    priority: 'High',
    citizen: {
      name: 'Rajesh Kumar',
      phone: '+91 98765 43210',
      email: 'rajesh.k@email.com',
      aadhaar: 'XXXX-XXXX-8821',
      address: 'House No. 45, Ward 12, Sector 4, Bangalore - 560001'
    },
    location: { lat: 12.9716, lng: 77.5946, address: 'Ward 12, Sector 4, Bangalore' },
    files: [
      { name: 'water_issue_photo1.jpg', size: '2.4 MB', type: 'image' },
      { name: 'water_issue_photo2.jpg', size: '1.8 MB', type: 'image' },
    ],
    timeline: [
      { date: '2024-03-28 10:30 AM', event: 'Complaint Registered', by: 'System' },
      { date: '2024-03-28 10:35 AM', event: 'Assigned to Operator', by: 'Auto-Assignment' },
    ]
  }

  const handleUpdateStatus = (e) => {
    e.preventDefault()
    alert('Status updated successfully!')
  }

  return (
    <OperatorLayout active="complaints">
      
      {/* Back Button */}
      <button
        onClick={() => navigate('/operator/complaints')}
        style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          padding: '8px 16px', borderRadius: '10px',
          backgroundColor: '#fff', border: '1px solid #e0d5c8',
          color: '#555', fontSize: '14px', fontWeight: '600',
          cursor: 'pointer', marginBottom: '24px',
        }}
      >
        <MdArrowBack size={18} /> Back to Complaints
      </button>

      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px', flexWrap: 'wrap' }}>
          <h1 style={{ fontSize: '32px', fontWeight: '900', color: '#1a1a1a', margin: 0 }}>
            {complaint.title}
          </h1>
          {complaint.priority === 'High' && (
            <span style={{
              padding: '5px 14px', borderRadius: '999px',
              backgroundColor: '#fef0e6', color: '#2596be',
              fontSize: '11px', fontWeight: '800', letterSpacing: '0.5px',
            }}>
              HIGH PRIORITY
            </span>
          )}
        </div>
        <p style={{ fontSize: '14px', fontWeight: '600', color: '#9e8e80', margin: 0 }}>
          {complaint.id} • {complaint.sector}
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '24px', alignItems: 'start' }}>
        
        {/* Left Column - Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Citizen Info */}
          <div style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '28px', border: '1px solid #ede5d8' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <div style={{ width: '4px', height: '20px', borderRadius: '4px', backgroundColor: '#41A465' }} />
              <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#1a1a1a', margin: 0 }}>
                Citizen Information
              </h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <MdPerson size={18} color="#6b5e52" />
                <div>
                  <p style={{ fontSize: '12px', color: '#9e8e80', margin: '0 0 2px' }}>Name</p>
                  <p style={{ fontSize: '14px', fontWeight: '600', color: '#1a1a1a', margin: 0 }}>{complaint.citizen.name}</p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <MdPhone size={18} color="#6b5e52" />
                <div>
                  <p style={{ fontSize: '12px', color: '#9e8e80', margin: '0 0 2px' }}>Phone</p>
                  <p style={{ fontSize: '14px', fontWeight: '600', color: '#1a1a1a', margin: 0 }}>{complaint.citizen.phone}</p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <MdEmail size={18} color="#6b5e52" />
                <div>
                  <p style={{ fontSize: '12px', color: '#9e8e80', margin: '0 0 2px' }}>Email</p>
                  <p style={{ fontSize: '14px', fontWeight: '600', color: '#1a1a1a', margin: 0 }}>{complaint.citizen.email}</p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <MdLocationOn size={18} color="#6b5e52" />
                <div>
                  <p style={{ fontSize: '12px', color: '#9e8e80', margin: '0 0 2px' }}>Address</p>
                  <p style={{ fontSize: '14px', fontWeight: '600', color: '#1a1a1a', margin: 0 }}>{complaint.citizen.address}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Issue Description */}
          <div style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '28px', border: '1px solid #ede5d8' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{ width: '4px', height: '20px', borderRadius: '4px', backgroundColor: '#2596be' }} />
              <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#1a1a1a', margin: 0 }}>
                Issue Description
              </h2>
            </div>
            <p style={{ fontSize: '15px', color: '#6b5e52', margin: 0, lineHeight: 1.7 }}>
              {complaint.description}
            </p>
          </div>

          {/* Uploaded Files */}
          <div style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '28px', border: '1px solid #ede5d8' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{ width: '4px', height: '20px', borderRadius: '4px', backgroundColor: '#2563eb' }} />
              <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#1a1a1a', margin: 0 }}>
                Uploaded Files
              </h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {complaint.files.map((file, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '14px', borderRadius: '10px',
                  backgroundColor: '#faf6f0', border: '1px solid #ede5d8',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '36px', height: '36px', borderRadius: '8px',
                      backgroundColor: '#eff6ff', display: 'flex',
                      alignItems: 'center', justifyContent: 'center',
                    }}>
                      📷
                    </div>
                    <div>
                      <p style={{ fontSize: '14px', fontWeight: '600', color: '#1a1a1a', margin: '0 0 2px' }}>
                        {file.name}
                      </p>
                      <p style={{ fontSize: '12px', color: '#9e8e80', margin: 0 }}>{file.size}</p>
                    </div>
                  </div>
                  <button style={{
                    padding: '6px 14px', borderRadius: '8px',
                    backgroundColor: '#41A465', border: 'none',
                    color: '#fff', fontSize: '12px', fontWeight: '600',
                    cursor: 'pointer',
                  }}>
                    View
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Location Map */}
          <div style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '28px', border: '1px solid #ede5d8' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{ width: '4px', height: '20px', borderRadius: '4px', backgroundColor: '#41A465' }} />
              <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#1a1a1a', margin: 0 }}>
                Location
              </h2>
            </div>
            <div style={{
              height: '200px', borderRadius: '12px',
              backgroundColor: '#f0f0ee', border: '1px solid #e0d5c8',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: '12px',
            }}>
              <p style={{ fontSize: '14px', color: '#9e8e80' }}>🗺️ Map View (Integration Pending)</p>
            </div>
            <p style={{ fontSize: '14px', color: '#6b5e52', margin: 0 }}>
              📍 {complaint.location.address}
            </p>
          </div>

        </div>

        {/* Right Column - Action Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Update Status */}
          <div style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '24px', border: '1px solid #ede5d8' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1a1a1a', margin: '0 0 16px' }}>
              Update Status
            </h3>
            <form onSubmit={handleUpdateStatus}>
              <select
                value={status}
                onChange={e => setStatus(e.target.value)}
                style={{
                  width: '100%', padding: '12px 14px', fontSize: '14px',
                  border: '1.5px solid #e0d5c8', borderRadius: '10px',
                  backgroundColor: '#faf6f0', outline: 'none',
                  fontWeight: '600', cursor: 'pointer', marginBottom: '16px',
                }}
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
                <option value="Rejected">Rejected</option>
                <option value="Escalated">Escalated</option>
              </select>

              <label style={{ fontSize: '13px', fontWeight: '600', color: '#3a3a3a', marginBottom: '8px', display: 'block' }}>
                Add Remarks
              </label>
              <textarea
                value={remarks}
                onChange={e => setRemarks(e.target.value)}
                placeholder="Enter your remarks or notes..."
                rows={4}
                style={{
                  width: '100%', padding: '12px 14px', fontSize: '14px',
                  border: '1.5px solid #e0d5c8', borderRadius: '10px',
                  backgroundColor: '#faf6f0', outline: 'none',
                  fontFamily: 'inherit', resize: 'vertical', marginBottom: '16px',
                }}
              />

              <label style={{ fontSize: '13px', fontWeight: '600', color: '#3a3a3a', marginBottom: '8px', display: 'block' }}>
                Upload Proof (Optional)
              </label>
              <label style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                padding: '12px', borderRadius: '10px',
                border: '1.5px dashed #e0d5c8', backgroundColor: '#faf6f0',
                cursor: 'pointer', marginBottom: '16px',
              }}>
                <MdUpload size={18} color="#6b5e52" />
                <span style={{ fontSize: '13px', fontWeight: '600', color: '#6b5e52' }}>
                  {proofFile ? proofFile.name : 'Choose File'}
                </span>
                <input
                  type="file"
                  onChange={e => setProofFile(e.target.files[0])}
                  style={{ display: 'none' }}
                />
              </label>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  width: '100%', padding: '12px', borderRadius: '10px',
                  backgroundColor: '#41A465', border: 'none',
                  color: '#fff', fontSize: '14px', fontWeight: '700',
                  cursor: 'pointer', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', gap: '8px',
                }}
              >
                <MdSend size={18} /> Update Status
              </motion.button>
            </form>
          </div>

          {/* Assign / Forward */}
          <div style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '24px', border: '1px solid #ede5d8' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1a1a1a', margin: '0 0 16px' }}>
              Assign / Forward
            </h3>
            <label style={{ fontSize: '13px', fontWeight: '600', color: '#3a3a3a', marginBottom: '8px', display: 'block' }}>
              Assign To
            </label>
            <select
              value={assignTo}
              onChange={e => setAssignTo(e.target.value)}
              style={{
                width: '100%', padding: '12px 14px', fontSize: '14px',
                border: '1.5px solid #e0d5c8', borderRadius: '10px',
                backgroundColor: '#faf6f0', outline: 'none',
                fontWeight: '600', cursor: 'pointer', marginBottom: '16px',
              }}
            >
              <option value="">Select Officer/Department</option>
              <optgroup label="Field Officers">
                <option value="officer-1">Officer Ramesh Kumar</option>
                <option value="officer-2">Officer Priya Sharma</option>
                <option value="officer-3">Officer Anil Reddy</option>
              </optgroup>
              <optgroup label="Taluk Level">
                <option value="taluk-north">Taluk Office - North</option>
                <option value="taluk-south">Taluk Office - South</option>
                <option value="taluk-east">Taluk Office - East</option>
              </optgroup>
            </select>

            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              style={{
                width: '100%', padding: '12px', borderRadius: '10px',
                backgroundColor: '#2596be', border: 'none',
                color: '#fff', fontSize: '14px', fontWeight: '700',
                cursor: 'pointer',
              }}
            >
              Assign Task
            </motion.button>
          </div>

          {/* Timeline */}
          <div style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '24px', border: '1px solid #ede5d8' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1a1a1a', margin: '0 0 16px' }}>
              Status Timeline
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {complaint.timeline.map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: '12px' }}>
                  <div style={{
                    width: '8px', height: '8px', borderRadius: '50%',
                    backgroundColor: '#41A465', marginTop: '6px', flexShrink: 0,
                  }} />
                  <div>
                    <p style={{ fontSize: '13px', fontWeight: '700', color: '#1a1a1a', margin: '0 0 4px' }}>
                      {item.event}
                    </p>
                    <p style={{ fontSize: '12px', color: '#9e8e80', margin: 0 }}>
                      {item.date} • by {item.by}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </OperatorLayout>
  )
}
