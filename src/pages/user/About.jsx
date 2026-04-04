import { motion } from 'framer-motion'
import { MdCheckCircle, MdArrowForward } from 'react-icons/md'
import { RiGovernmentLine } from 'react-icons/ri'
import UserLayout from './UserLayout'

const departments = [
  { name: 'Agriculture', icon: '🌾', desc: 'Crop issues, irrigation, subsidies' },
  { name: 'Education', icon: '📚', desc: 'Schools, scholarships, infrastructure' },
  { name: 'Healthcare', icon: '🏥', desc: 'Hospitals, medicines, sanitation' },
  { name: 'Police', icon: '👮', desc: 'Law & order, safety concerns' },
  { name: 'Revenue', icon: '📋', desc: 'Land records, certificates, taxes' },
  { name: 'Infrastructure', icon: '🏗️', desc: 'Roads, water supply, electricity' },
  { name: 'Public Utilities', icon: '💡', desc: 'Street lights, waste management' },
  { name: 'Environment', icon: '🌳', desc: 'Pollution, parks, green initiatives' },
]

const howItWorks = [
  {
    step: '1',
    title: 'Register & Login',
    desc: 'Create your account using mobile OTP verification. Your Aadhaar details are encrypted and secure.',
    icon: '📱'
  },
  {
    step: '2',
    title: 'Submit Complaint',
    desc: 'Select the relevant department, describe your issue, attach photos/documents, and pin your location.',
    icon: '📝'
  },
  {
    step: '3',
    title: 'Auto Assignment',
    desc: 'Your complaint is automatically assigned to the concerned department officer based on location and category.',
    icon: '🎯'
  },
  {
    step: '4',
    title: 'Track Progress',
    desc: 'Monitor real-time status updates, view officer remarks, and receive SMS/app notifications at every stage.',
    icon: '📊'
  },
  {
    step: '5',
    title: 'Resolution',
    desc: 'Once resolved, verify the solution. If unsatisfied, you can reopen or escalate the complaint.',
    icon: '✅'
  }
]

export default function About() {
  return (
    <UserLayout active="about">
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ marginBottom: '48px', textAlign: 'center' }}
        >
          <div style={{
            width: '80px',
            height: '80px',
            margin: '0 auto 24px',
            borderRadius: '20px',
            background: 'linear-gradient(135deg, #2596be, #ff6b1a)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff'
          }}>
            <RiGovernmentLine size={40} />
          </div>
          <h1 style={{ fontSize: '36px', fontWeight: '900', color: '#1a1a1a', margin: '0 0 16px 0' }}>
            About IGMS
          </h1>
          <p style={{ fontSize: '18px', color: '#6b5e52', lineHeight: 1.7, maxWidth: '700px', margin: '0 auto' }}>
            The Integrated Grievance Management System is a digital platform designed to empower citizens 
            by providing a transparent, efficient, and accountable mechanism for addressing public grievances.
          </p>
        </motion.div>

        {/* Objective Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{
            backgroundColor: '#fff',
            borderRadius: '20px',
            padding: '32px',
            border: '1px solid #ede5d8',
            marginBottom: '32px'
          }}
        >
          <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#1a1a1a', margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: '#fef0e6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px'
            }}>🎯</span>
            Our Objective
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              'Provide a single-window platform for citizens to register complaints across all government departments',
              'Ensure timely resolution through automated assignment and tracking mechanisms',
              'Maintain transparency with real-time status updates and officer accountability',
              'Enable data-driven decision making for administrative improvements',
              'Bridge the gap between citizens and government services through technology'
            ].map((objective, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                style={{ display: 'flex', alignItems: 'start', gap: '12px' }}
              >
                <MdCheckCircle size={24} color="#41A465" style={{ flexShrink: 0, marginTop: '2px' }} />
                <p style={{ fontSize: '15px', color: '#3a3a3a', lineHeight: 1.7, margin: 0 }}>
                  {objective}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Departments Covered */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          style={{ marginBottom: '32px' }}
        >
          <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#1a1a1a', margin: '0 0 24px 0' }}>
            Departments Covered
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '16px'
          }}>
            {departments.map((dept, i) => (
              <motion.div
                key={dept.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.05 }}
                whileHover={{ y: -5, scale: 1.02 }}
                style={{
                  backgroundColor: '#fff',
                  borderRadius: '16px',
                  padding: '24px',
                  border: '1px solid #ede5d8',
                  cursor: 'pointer',
                  transition: 'all 0.3s'
                }}
              >
                <div style={{ fontSize: '36px', marginBottom: '12px' }}>{dept.icon}</div>
                <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1a1a1a', margin: '0 0 8px 0' }}>
                  {dept.name}
                </h3>
                <p style={{ fontSize: '13px', color: '#6b5e52', lineHeight: 1.5, margin: 0 }}>
                  {dept.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* How It Works */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          style={{ marginBottom: '48px' }}
        >
          <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#1a1a1a', margin: '0 0 24px 0' }}>
            How It Works
          </h2>
          <div style={{ position: 'relative' }}>
            {howItWorks.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + i * 0.1 }}
                style={{
                  display: 'flex',
                  gap: '20px',
                  marginBottom: i < howItWorks.length - 1 ? '32px' : '0'
                }}
              >
                {/* Step Number */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #2596be, #ff6b1a)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontSize: '24px',
                    fontWeight: '800',
                    flexShrink: 0
                  }}>
                    {item.step}
                  </div>
                  {i < howItWorks.length - 1 && (
                    <div style={{
                      width: '2px',
                      flex: 1,
                      minHeight: '40px',
                      background: 'linear-gradient(to bottom, #2596be, #ede5d8)',
                      marginTop: '8px'
                    }} />
                  )}
                </div>

                {/* Content */}
                <div style={{
                  flex: 1,
                  backgroundColor: '#fff',
                  borderRadius: '16px',
                  padding: '24px',
                  border: '1px solid #ede5d8'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                    <span style={{ fontSize: '32px' }}>{item.icon}</span>
                    <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1a1a1a', margin: 0 }}>
                      {item.title}
                    </h3>
                  </div>
                  <p style={{ fontSize: '15px', color: '#6b5e52', lineHeight: 1.7, margin: 0 }}>
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          style={{
            backgroundColor: '#fef0e6',
            borderRadius: '20px',
            padding: '40px',
            border: '2px solid #2596be',
            textAlign: 'center',
            marginBottom: '32px'
          }}
        >
          <h3 style={{ fontSize: '24px', fontWeight: '800', color: '#1a1a1a', margin: '0 0 16px 0' }}>
            Ready to Submit Your Complaint?
          </h3>
          <p style={{ fontSize: '16px', color: '#6b5e52', margin: '0 0 24px 0', lineHeight: 1.7 }}>
            Join thousands of citizens who have successfully resolved their grievances through IGMS
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.href = '/user/submit'}
            style={{
              padding: '16px 32px',
              borderRadius: '12px',
              backgroundColor: '#2596be',
              color: '#fff',
              fontSize: '16px',
              fontWeight: '700',
              border: 'none',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 14px rgba(231, 83, 0, 0.3)'
            }}
          >
            Submit Complaint <MdArrowForward size={20} />
          </motion.button>
        </motion.div>

      </div>
    </UserLayout>
  )
}
