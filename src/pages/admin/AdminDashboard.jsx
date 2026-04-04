import { motion } from 'framer-motion'
import { 
  MdPeople, 
  MdAssignment, 
  MdCheckCircle, 
  MdPending,
  MdTrendingUp,
  MdTrendingDown
} from 'react-icons/md'
import AdminLayout from './AdminLayout'

const stats = [
  { 
    label: 'Total Users', 
    value: '2,543', 
    change: '+12%', 
    trend: 'up',
    icon: MdPeople, 
    color: '#2596be', 
    bg: '#fef0e6' 
  },
  { 
    label: 'Total Complaints', 
    value: '1,234', 
    change: '+8%', 
    trend: 'up',
    icon: MdAssignment, 
    color: '#2563eb', 
    bg: '#eff6ff' 
  },
  { 
    label: 'Resolved', 
    value: '892', 
    change: '+15%', 
    trend: 'up',
    icon: MdCheckCircle, 
    color: '#41A465', 
    bg: '#edf7f1' 
  },
  { 
    label: 'Pending', 
    value: '342', 
    change: '-5%', 
    trend: 'down',
    icon: MdPending, 
    color: '#f59e0b', 
    bg: '#fef3c7' 
  },
]

const recentComplaints = [
  { id: '#IGMS-2024-9234', title: 'Water Supply Disruption - Ward 12', user: 'Rajesh Kumar', status: 'Pending', statusColor: '#f59e0b', statusBg: '#fef3c7', time: '15 mins ago' },
  { id: '#IGMS-2024-9233', title: 'Street Light Not Working - MG Road', user: 'Priya Sharma', status: 'In Progress', statusColor: '#2563eb', statusBg: '#eff6ff', time: '1 hour ago' },
  { id: '#IGMS-2024-9232', title: 'Garbage Collection Delay', user: 'Amit Patel', status: 'Resolved', statusColor: '#41A465', statusBg: '#edf7f1', time: '2 hours ago' },
  { id: '#IGMS-2024-9231', title: 'Road Pothole Repair Request', user: 'Sunita Devi', status: 'Resolved', statusColor: '#41A465', statusBg: '#edf7f1', time: '3 hours ago' },
]

const recentUsers = [
  { name: 'Rajesh Kumar', phone: '9876543210', registered: '2 hours ago', status: 'Active' },
  { name: 'Priya Sharma', phone: '9876543211', registered: '5 hours ago', status: 'Active' },
  { name: 'Amit Patel', phone: '9876543212', registered: '1 day ago', status: 'Active' },
  { name: 'Sunita Devi', phone: '9876543213', registered: '2 days ago', status: 'Active' },
]

export default function AdminDashboard() {
  return (
    <AdminLayout active="dashboard">
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '900', color: '#1a1a1a', margin: '0 0 8px' }}>
          Dashboard Overview
        </h1>
        <p style={{ fontSize: '16px', color: '#6b5e52', margin: 0 }}>
          Monitor system-wide metrics and activities
        </p>
      </div>

      {/* Stats Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '20px', 
        marginBottom: '32px' 
      }}>
        {stats.map((stat, i) => {
          const Icon = stat.icon
          const TrendIcon = stat.trend === 'up' ? MdTrendingUp : MdTrendingDown
          
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              style={{
                backgroundColor: '#fff',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid #e5e7eb',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  backgroundColor: stat.bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: stat.color,
                }}>
                  <Icon size={24} />
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  backgroundColor: stat.trend === 'up' ? '#edf7f1' : '#fef2f2',
                  color: stat.trend === 'up' ? '#41A465' : '#dc2626',
                  fontSize: '12px',
                  fontWeight: '600'
                }}>
                  <TrendIcon size={14} />
                  {stat.change}
                </div>
              </div>
              <p style={{ fontSize: '32px', fontWeight: '900', color: '#1a1a1a', margin: '0 0 4px', lineHeight: 1 }}>
                {stat.value}
              </p>
              <p style={{ fontSize: '14px', fontWeight: '500', color: '#6b5e52', margin: 0 }}>
                {stat.label}
              </p>
            </motion.div>
          )
        })}
      </div>

      {/* Two Column Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
        
        {/* Recent Complaints */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          style={{
            backgroundColor: '#fff',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid #e5e7eb',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#1a1a1a', margin: 0 }}>
              Recent Complaints
            </h2>
            <button style={{
              background: 'none',
              border: 'none',
              color: '#2596be',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer'
            }}>
              View All →
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {recentComplaints.map((complaint, i) => (
              <motion.div
                key={complaint.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                style={{
                  padding: '16px',
                  borderRadius: '12px',
                  backgroundColor: '#f9fafb',
                  border: '1px solid #e5e7eb',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                whileHover={{ backgroundColor: '#f3f4f6' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '11px', fontWeight: '600', color: '#9e8e80', margin: '0 0 4px' }}>
                      {complaint.id}
                    </p>
                    <p style={{ fontSize: '14px', fontWeight: '600', color: '#1a1a1a', margin: '0 0 4px' }}>
                      {complaint.title}
                    </p>
                    <p style={{ fontSize: '12px', color: '#6b5e52', margin: 0 }}>
                      By {complaint.user} • {complaint.time}
                    </p>
                  </div>
                  <span style={{
                    padding: '4px 12px',
                    borderRadius: '999px',
                    backgroundColor: complaint.statusBg,
                    color: complaint.statusColor,
                    fontSize: '11px',
                    fontWeight: '700',
                    whiteSpace: 'nowrap',
                    marginLeft: '12px'
                  }}>
                    {complaint.status}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recent Users */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          style={{
            backgroundColor: '#fff',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid #e5e7eb',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#1a1a1a', margin: 0 }}>
              Recent Users
            </h2>
            <button style={{
              background: 'none',
              border: 'none',
              color: '#2596be',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer'
            }}>
              View All →
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {recentUsers.map((user, i) => (
              <motion.div
                key={user.phone}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                style={{
                  padding: '16px',
                  borderRadius: '12px',
                  backgroundColor: '#f9fafb',
                  border: '1px solid #e5e7eb',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}
                whileHover={{ backgroundColor: '#f3f4f6' }}
              >
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #2596be, #ff6b1a)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontWeight: '700',
                  fontSize: '16px',
                  flexShrink: 0
                }}>
                  {user.name.charAt(0)}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '14px', fontWeight: '600', color: '#1a1a1a', margin: '0 0 2px' }}>
                    {user.name}
                  </p>
                  <p style={{ fontSize: '12px', color: '#6b5e52', margin: 0 }}>
                    {user.phone} • {user.registered}
                  </p>
                </div>
                <span style={{
                  padding: '4px 12px',
                  borderRadius: '999px',
                  backgroundColor: '#edf7f1',
                  color: '#41A465',
                  fontSize: '11px',
                  fontWeight: '700'
                }}>
                  {user.status}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </AdminLayout>
  )
}
