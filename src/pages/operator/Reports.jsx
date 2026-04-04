import { useState } from 'react'
import { MdDownload, MdCalendarToday, MdAssessment } from 'react-icons/md'
import { motion } from 'framer-motion'
import OperatorLayout from './OperatorLayout'

const reportTypes = [
  { id: 'daily', label: 'Daily Report', desc: 'Today\'s complaint summary and resolution status', icon: '📅', color: '#2596be' },
  { id: 'weekly', label: 'Weekly Report', desc: 'Last 7 days performance metrics and trends', icon: '📊', color: '#2563eb' },
  { id: 'monthly', label: 'Monthly Report', desc: 'Complete monthly analysis and department statistics', icon: '📈', color: '#41A465' },
]

const sampleData = {
  daily: { total: 28, resolved: 12, pending: 8, inProgress: 6, escalated: 2 },
  weekly: { total: 156, resolved: 78, pending: 24, inProgress: 48, escalated: 6 },
  monthly: { total: 642, resolved: 398, pending: 89, inProgress: 142, escalated: 13 },
}

export default function Reports() {
  const [selectedReport, setSelectedReport] = useState('daily')
  const [dateRange, setDateRange] = useState({ from: '', to: '' })

  const data = sampleData[selectedReport]

  return (
    <OperatorLayout active="reports">
      
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '36px', fontWeight: '900', color: '#1a1a1a', margin: '0 0 8px' }}>
          Department Reports
        </h1>
        <p style={{ fontSize: '16px', color: '#6b5e52', margin: 0 }}>
          Generate and download comprehensive reports for daily, weekly, and monthly performance analysis.
        </p>
      </div>

      {/* Report Type Selection */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '28px' }}>
        {reportTypes.map(type => (
          <motion.div
            key={type.id}
            whileHover={{ y: -5, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedReport(type.id)}
            style={{
              backgroundColor: selectedReport === type.id ? type.color : '#fff',
              color: selectedReport === type.id ? '#fff' : '#1a1a1a',
              borderRadius: '16px', padding: '24px',
              border: selectedReport === type.id ? 'none' : '1px solid #ede5d8',
              cursor: 'pointer',
              boxShadow: selectedReport === type.id ? `0 8px 24px ${type.color}40` : '0 2px 8px rgba(0,0,0,0.04)',
            }}
          >
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>{type.icon}</div>
            <h3 style={{ fontSize: '18px', fontWeight: '800', margin: '0 0 6px' }}>
              {type.label}
            </h3>
            <p style={{
              fontSize: '13px',
              margin: 0,
              opacity: selectedReport === type.id ? 0.9 : 0.7,
            }}>
              {type.desc}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Date Range Selector */}
      <div style={{
        backgroundColor: '#fff', borderRadius: '20px',
        padding: '24px', border: '1px solid #ede5d8',
        marginBottom: '24px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <MdCalendarToday size={18} color="#41A465" />
          <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1a1a1a', margin: 0 }}>
            Custom Date Range (Optional)
          </h3>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '13px', fontWeight: '600', color: '#3a3a3a', marginBottom: '8px', display: 'block' }}>
              From Date
            </label>
            <input
              type="date"
              value={dateRange.from}
              onChange={e => setDateRange({...dateRange, from: e.target.value})}
              style={{
                width: '100%', padding: '12px 14px', fontSize: '14px',
                border: '1.5px solid #e0d5c8', borderRadius: '10px',
                backgroundColor: '#faf6f0', outline: 'none',
                fontWeight: '600', cursor: 'pointer',
              }}
            />
          </div>
          <div>
            <label style={{ fontSize: '13px', fontWeight: '600', color: '#3a3a3a', marginBottom: '8px', display: 'block' }}>
              To Date
            </label>
            <input
              type="date"
              value={dateRange.to}
              onChange={e => setDateRange({...dateRange, to: e.target.value})}
              style={{
                width: '100%', padding: '12px 14px', fontSize: '14px',
                border: '1.5px solid #e0d5c8', borderRadius: '10px',
                backgroundColor: '#faf6f0', outline: 'none',
                fontWeight: '600', cursor: 'pointer',
              }}
            />
          </div>
        </div>
      </div>

      {/* Report Preview */}
      <div style={{
        backgroundColor: '#fff', borderRadius: '20px',
        padding: '28px', border: '1px solid #ede5d8',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <MdAssessment size={24} color="#41A465" />
            <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#1a1a1a', margin: 0 }}>
              Report Preview
            </h2>
          </div>
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '12px 24px', borderRadius: '12px',
              backgroundColor: '#41A465', border: 'none',
              color: '#fff', fontSize: '14px', fontWeight: '700',
              cursor: 'pointer', boxShadow: '0 4px 14px rgba(65, 164, 101, 0.3)',
            }}
          >
            <MdDownload size={18} /> Download Report
          </motion.button>
        </div>

        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px' }}>
          {[
            { label: 'Total', value: data.total, color: '#1a1a1a', bg: '#f0f0ee' },
            { label: 'Resolved', value: data.resolved, color: '#41A465', bg: '#edf7f1' },
            { label: 'Pending', value: data.pending, color: '#2596be', bg: '#fef0e6' },
            { label: 'In Progress', value: data.inProgress, color: '#2563eb', bg: '#eff6ff' },
            { label: 'Escalated', value: data.escalated, color: '#dc2626', bg: '#fef2f2' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              style={{
                backgroundColor: stat.bg, borderRadius: '14px',
                padding: '20px', border: '1px solid #ede5d8',
                textAlign: 'center',
              }}
            >
              <p style={{ fontSize: '32px', fontWeight: '900', color: stat.color, margin: '0 0 6px', lineHeight: 1 }}>
                {stat.value}
              </p>
              <p style={{ fontSize: '13px', fontWeight: '600', color: '#6b5e52', margin: 0 }}>
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Additional Info */}
        <div style={{ marginTop: '24px', padding: '20px', borderRadius: '12px', backgroundColor: '#faf6f0' }}>
          <p style={{ fontSize: '14px', color: '#6b5e52', margin: 0, lineHeight: 1.6 }}>
            📊 This report includes complaint statistics, resolution rates, department performance, and officer efficiency metrics. Download the full report for detailed analysis and charts.
          </p>
        </div>
      </div>

    </OperatorLayout>
  )
}
