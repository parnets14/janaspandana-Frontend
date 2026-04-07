import { useState } from 'react'
import { MdNotifications, MdCheckCircle, MdInfo, MdWarning } from 'react-icons/md'
import { motion } from 'framer-motion'
import UserLayout from './UserLayout'

const notifications = [
  {
    id: 1,
    type: 'update',
    icon: <MdCheckCircle size={20} />,
    iconBg: '#edf7f1',
    iconColor: '#41A465',
    title: 'Complaint Resolved',
    message: 'Your complaint #IGMS-8821 regarding street light malfunction has been successfully resolved.',
    time: '2 hours ago',
    read: false,
  },
  {
    id: 2,
    type: 'info',
    icon: <MdInfo size={20} />,
    iconBg: '#eff6ff',
    iconColor: '#2563eb',
    title: 'Status Update',
    message: 'Your complaint #IGMS-9045 is now in progress. Field officer has been assigned.',
    time: '5 hours ago',
    read: false,
  },
  {
    id: 3,
    type: 'system',
    icon: <MdNotifications size={20} />,
    iconBg: '#EEF2FF',
    iconColor: '#151A40',
    title: 'System Maintenance Scheduled',
    message: 'The IGMS portal will undergo scheduled maintenance on Sunday, 2:00 AM - 4:00 AM.',
    time: 'Yesterday',
    read: true,
  },
  {
    id: 4,
    type: 'warning',
    icon: <MdWarning size={20} />,
    iconBg: '#EEF2FF',
    iconColor: '#151A40',
    title: 'Action Required',
    message: 'Please upload additional photos for complaint #IGMS-9102 to help with the investigation.',
    time: '2 days ago',
    read: true,
  },
  {
    id: 5,
    type: 'info',
    icon: <MdInfo size={20} />,
    iconBg: '#eff6ff',
    iconColor: '#2563eb',
    title: 'New Feature Available',
    message: 'You can now track your complaints in real-time with our enhanced tracking system.',
    time: '3 days ago',
    read: true,
  },
]

export default function Notifications() {
  const [filter, setFilter] = useState('all') // 'all' | 'unread'

  const filtered = notifications.filter(n => 
    filter === 'all' || (filter === 'unread' && !n.read)
  )

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <UserLayout active="notifications">
      
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', flexWrap: 'wrap', gap: '16px' }}>
          <h1 style={{ fontSize: '36px', fontWeight: '900', color: '#1a1a1a', margin: 0 }}>
            Notifications
          </h1>
          {unreadCount > 0 && (
            <span style={{
              padding: '6px 16px', borderRadius: '999px',
              backgroundColor: '#EEF2FF', color: '#151A40',
              fontSize: '13px', fontWeight: '700',
            }}>
              {unreadCount} Unread
            </span>
          )}
        </div>
        <p style={{ fontSize: '16px', color: '#6b5e52', margin: 0 }}>
          Stay updated with complaint status changes, department updates, and system announcements.
        </p>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
        <button
          onClick={() => setFilter('all')}
          style={{
            padding: '10px 24px', borderRadius: '10px',
            border: '1.5px solid',
            borderColor: filter === 'all' ? '#151A40' : '#E5E7EB',
            backgroundColor: filter === 'all' ? '#151A40' : '#fff',
            color: filter === 'all' ? '#fff' : '#555',
            fontSize: '14px', fontWeight: '700', cursor: 'pointer',
          }}
        >
          All Notifications
        </button>
        <button
          onClick={() => setFilter('unread')}
          style={{
            padding: '10px 24px', borderRadius: '10px',
            border: '1.5px solid',
            borderColor: filter === 'unread' ? '#151A40' : '#E5E7EB',
            backgroundColor: filter === 'unread' ? '#151A40' : '#fff',
            color: filter === 'unread' ? '#fff' : '#555',
            fontSize: '14px', fontWeight: '700', cursor: 'pointer',
          }}
        >
          Unread ({unreadCount})
        </button>
      </div>

      {/* Notifications List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {filtered.map((notif, i) => (
          <motion.div
            key={notif.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            style={{
              backgroundColor: notif.read ? '#fff' : '#EEF2FF',
              borderRadius: '16px', padding: '20px',
              border: notif.read ? '1px solid #E5E7EB' : '1px solid #fcd9c0',
              display: 'flex', gap: '16px',
            }}
          >
            <div style={{
              width: '44px', height: '44px', borderRadius: '12px',
              backgroundColor: notif.iconBg, color: notif.iconColor,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              {notif.icon}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', gap: '12px' }}>
                <p style={{ fontSize: '16px', fontWeight: '700', color: '#1a1a1a', margin: 0 }}>
                  {notif.title}
                </p>
                <span style={{ fontSize: '12px', color: '#9e8e80', whiteSpace: 'nowrap' }}>
                  {notif.time}
                </span>
              </div>
              <p style={{ fontSize: '14px', color: '#6b5e52', margin: 0, lineHeight: 1.6 }}>
                {notif.message}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

    </UserLayout>
  )
}
