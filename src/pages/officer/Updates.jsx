import { useState } from 'react'
import { MdAdd, MdSend, MdNotifications, MdDelete, MdEdit } from 'react-icons/md'
import { motion } from 'framer-motion'
import OfficerLayout from './OfficerLayout'

const existingUpdates = [
  { 
    id: 1, 
    title: 'System Maintenance Scheduled', 
    message: 'The IGMS portal will undergo scheduled maintenance on Sunday, 2:00 AM - 4:00 AM. Services may be temporarily unavailable.',
    date: '2024-03-28',
    time: '10:30 AM',
    priority: 'high',
    recipients: 'All Users'
  },
  { 
    id: 2, 
    title: 'New Complaint Categories Added', 
    message: 'We have added new categories for Environmental Issues and Public Health concerns. Please use appropriate categories when filing complaints.',
    date: '2024-03-25',
    time: '2:15 PM',
    priority: 'medium',
    recipients: 'All Users'
  },
]

export default function Updates() {
  const [showForm, setShowForm] = useState(false)
  const [updates, setUpdates] = useState(existingUpdates)
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    priority: 'medium',
    recipients: 'all'
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    const newUpdate = {
      id: Date.now(),
      title: formData.title,
      message: formData.message,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      priority: formData.priority,
      recipients: formData.recipients === 'all' ? 'All Users' : 'Specific Users'
    }
    setUpdates([newUpdate, ...updates])
    setFormData({ title: '', message: '', priority: 'medium', recipients: 'all' })
    setShowForm(false)
  }

  const handleDelete = (id) => {
    setUpdates(updates.filter(u => u.id !== id))
  }

  const priorityConfig = {
    high: { bg: '#fef0e6', color: '#2596be', label: 'High Priority' },
    medium: { bg: '#fff7ed', color: '#f59e0b', label: 'Medium Priority' },
    low: { bg: '#edf7f1', color: '#41A465', label: 'Low Priority' },
  }

  return (
    <OfficerLayout active="updates">
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', flexWrap: 'wrap' }}>
          <div>
            <h1 style={{ fontSize: '36px', fontWeight: '900', color: '#1a1a1a', margin: '0 0 8px' }}>
              Updates & Notifications
            </h1>
            <p style={{ fontSize: '16px', color: '#6b5e52', margin: 0 }}>
              Post important updates and announcements to reach all citizens using the platform.
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowForm(!showForm)}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '12px 24px', borderRadius: '12px',
              backgroundColor: '#2596be', color: '#fff',
              border: 'none', fontSize: '15px', fontWeight: '700',
              cursor: 'pointer', boxShadow: '0 4px 14px rgba(231, 83, 0, 0.3)',
            }}
          >
            <MdAdd size={20} /> Post Update
          </motion.button>
        </div>

        {/* Create Update Form */}
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              backgroundColor: '#fff', borderRadius: '20px',
              padding: '32px', border: '1px solid #ede5d8',
              marginBottom: '24px', boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
              <div style={{ width: '4px', height: '24px', borderRadius: '4px', backgroundColor: '#2596be' }} />
              <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#1a1a1a', margin: 0 }}>
                Create New Update
              </h2>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '14px', fontWeight: '600', color: '#3a3a3a', marginBottom: '8px', display: 'block' }}>
                  Update Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  placeholder="Enter a clear, concise title"
                  style={{
                    width: '100%', padding: '14px 16px', fontSize: '15px',
                    border: '1.5px solid #e0d5c8', borderRadius: '12px',
                    backgroundColor: '#faf6f0', outline: 'none',
                    fontWeight: '600',
                  }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '14px', fontWeight: '600', color: '#3a3a3a', marginBottom: '8px', display: 'block' }}>
                  Message *
                </label>
                <textarea
                  required
                  value={formData.message}
                  onChange={e => setFormData({...formData, message: e.target.value})}
                  placeholder="Write your update message here..."
                  rows={5}
                  style={{
                    width: '100%', padding: '14px 16px', fontSize: '14px',
                    border: '1.5px solid #e0d5c8', borderRadius: '12px',
                    backgroundColor: '#faf6f0', outline: 'none',
                    fontFamily: 'inherit', resize: 'vertical', lineHeight: '1.6',
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                <div>
                  <label style={{ fontSize: '14px', fontWeight: '600', color: '#3a3a3a', marginBottom: '8px', display: 'block' }}>
                    Priority Level
                  </label>
                  <select
                    value={formData.priority}
                    onChange={e => setFormData({...formData, priority: e.target.value})}
                    style={{
                      width: '100%', padding: '14px 16px', fontSize: '14px',
                      border: '1.5px solid #e0d5c8', borderRadius: '12px',
                      backgroundColor: '#faf6f0', outline: 'none',
                      fontWeight: '600', cursor: 'pointer',
                    }}
                  >
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '14px', fontWeight: '600', color: '#3a3a3a', marginBottom: '8px', display: 'block' }}>
                    Send To
                  </label>
                  <select
                    value={formData.recipients}
                    onChange={e => setFormData({...formData, recipients: e.target.value})}
                    style={{
                      width: '100%', padding: '14px 16px', fontSize: '14px',
                      border: '1.5px solid #e0d5c8', borderRadius: '12px',
                      backgroundColor: '#faf6f0', outline: 'none',
                      fontWeight: '600', cursor: 'pointer',
                    }}
                  >
                    <option value="all">All Users</option>
                    <option value="specific">Specific Users</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  style={{
                    flex: 1, padding: '14px', borderRadius: '12px',
                    backgroundColor: '#f0e8dc', border: '1px solid #e0d5c8',
                    color: '#555', fontSize: '15px', fontWeight: '600',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    flex: 1, padding: '14px', borderRadius: '12px',
                    backgroundColor: '#2596be', border: 'none',
                    color: '#fff', fontSize: '15px', fontWeight: '600',
                    cursor: 'pointer', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', gap: '8px',
                    boxShadow: '0 4px 14px rgba(231, 83, 0, 0.3)',
                  }}
                >
                  <MdSend size={18} /> Publish Update
                </motion.button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Updates List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {updates.length === 0 ? (
            <div style={{
              backgroundColor: '#fff', borderRadius: '20px',
              padding: '60px 32px', border: '1px solid #ede5d8',
              textAlign: 'center',
            }}>
              <MdNotifications size={48} color="#e0d5c8" style={{ margin: '0 auto 16px' }} />
              <p style={{ fontSize: '16px', fontWeight: '600', color: '#6b5e52', margin: 0 }}>
                No updates posted yet
              </p>
              <p style={{ fontSize: '14px', color: '#9e8e80', margin: '8px 0 0' }}>
                Click "Post Update" to create your first announcement
              </p>
            </div>
          ) : (
            updates.map((update, index) => (
              <motion.div
                key={update.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                style={{
                  backgroundColor: '#fff', borderRadius: '20px',
                  padding: '28px', border: '1px solid #ede5d8',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', gap: '16px' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', flexWrap: 'wrap' }}>
                      <span style={{
                        padding: '4px 12px', borderRadius: '999px',
                        backgroundColor: priorityConfig[update.priority].bg,
                        color: priorityConfig[update.priority].color,
                        fontSize: '11px', fontWeight: '800', letterSpacing: '0.5px',
                      }}>
                        {priorityConfig[update.priority].label.toUpperCase()}
                      </span>
                      <span style={{ fontSize: '13px', color: '#9e8e80' }}>
                        {update.date} • {update.time}
                      </span>
                    </div>
                    <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#1a1a1a', margin: '0 0 10px', lineHeight: 1.3 }}>
                      {update.title}
                    </h3>
                    <p style={{ fontSize: '15px', color: '#6b5e52', margin: '0 0 12px', lineHeight: 1.6 }}>
                      {update.message}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <MdNotifications size={16} color="#41A465" />
                      <span style={{ fontSize: '13px', fontWeight: '600', color: '#41A465' }}>
                        Sent to: {update.recipients}
                      </span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => {}}
                      style={{
                        width: '36px', height: '36px', borderRadius: '10px',
                        border: '1px solid #e0d5c8', backgroundColor: '#faf6f0',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer',
                      }}
                    >
                      <MdEdit size={18} color="#555" />
                    </button>
                    <button
                      onClick={() => handleDelete(update.id)}
                      style={{
                        width: '36px', height: '36px', borderRadius: '10px',
                        border: '1px solid #fcd9c0', backgroundColor: '#fef0e6',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer',
                      }}
                    >
                      <MdDelete size={18} color="#2596be" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>

      </div>
    </OfficerLayout>
  )
}
