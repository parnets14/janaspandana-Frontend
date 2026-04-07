import { useState } from 'react'
import { MdExpandMore, MdPhone, MdEmail, MdLocationOn } from 'react-icons/md'
import { motion, AnimatePresence } from 'framer-motion'
import UserLayout from './UserLayout'

const faqs = [
  {
    q: 'How do I submit a complaint?',
    a: 'Click on "Submit Complaint" from your dashboard, select the appropriate sector, fill in the details, upload supporting documents if any, and submit. You will receive a unique complaint ID for tracking.'
  },
  {
    q: 'How long does it take to resolve a complaint?',
    a: 'Resolution time varies by complaint type and priority. High priority issues are typically resolved within 48 hours, while standard complaints may take 5-7 working days. You can track real-time status updates.'
  },
  {
    q: 'Can I track my complaint status?',
    a: 'Yes! You can track your complaint using the complaint ID from "My Complaints" section or the public tracking page. You will also receive SMS and in-app notifications for status updates.'
  },
  {
    q: 'What if I\'m not satisfied with the resolution?',
    a: 'If you are not satisfied with the resolution, you can request to reopen the complaint from the complaint detail page. Provide a clear reason and the case will be reviewed again.'
  },
  {
    q: 'How do I update my profile information?',
    a: 'Go to the Profile section from the navigation menu. You can update your name, contact details, address, and profile photo. Changes are saved automatically.'
  },
  {
    q: 'Is my data secure?',
    a: 'Yes, all data is encrypted and stored securely. We follow government security protocols and your information is only accessible to authorized personnel handling your complaint.'
  },
  {
    q: 'Can I submit complaints in Kannada?',
    a: 'Yes, the platform supports both English and Kannada. Use the language toggle in your profile settings to switch between languages.'
  },
  {
    q: 'What documents can I upload?',
    a: 'You can upload images (JPG, PNG), documents (PDF), and videos (MP4) up to 10MB per file. Multiple files can be attached to support your complaint.'
  },
]

export default function Help() {
  const [openIndex, setOpenIndex] = useState(null)

  return (
    <UserLayout active="help">
      
      {/* Header */}
      <div style={{ marginBottom: '32px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '36px', fontWeight: '900', color: '#1a1a1a', margin: '0 0 8px' }}>
          Help & Support
        </h1>
        <p style={{ fontSize: '16px', color: '#6b5e52', margin: 0 }}>
          Find answers to common questions or reach out to our support team.
        </p>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        
        {/* FAQs */}
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#1a1a1a', margin: '0 0 20px' }}>
            Frequently Asked Questions
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                style={{
                  backgroundColor: '#fff', borderRadius: '16px',
                  border: '1px solid #E5E7EB', overflow: 'hidden',
                }}
              >
                <button
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  style={{
                    width: '100%', padding: '20px', border: 'none',
                    backgroundColor: openIndex === i ? '#F8F9FA' : 'transparent',
                    cursor: 'pointer', display: 'flex',
                    justifyContent: 'space-between', alignItems: 'center',
                    gap: '16px', textAlign: 'left',
                  }}
                >
                  <span style={{ fontSize: '15px', fontWeight: '700', color: '#1a1a1a' }}>
                    {faq.q}
                  </span>
                  <motion.div
                    animate={{ rotate: openIndex === i ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <MdExpandMore size={24} color="#6b5e52" />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {openIndex === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      style={{ overflow: 'hidden' }}
                    >
                      <div style={{ padding: '0 20px 20px', borderTop: '1px solid #E5E7EB' }}>
                        <p style={{ fontSize: '14px', color: '#6b5e52', margin: '16px 0 0', lineHeight: 1.7 }}>
                          {faq.a}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Contact Info */}
        <div style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '28px', border: '1px solid #E5E7EB' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#1a1a1a', margin: '0 0 20px' }}>
            Contact Support
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{
                width: '44px', height: '44px', borderRadius: '12px',
                backgroundColor: '#edf7f1', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
              }}>
                <MdPhone size={20} color="#41A465" />
              </div>
              <div>
                <p style={{ fontSize: '13px', color: '#9e8e80', margin: '0 0 4px' }}>Helpline</p>
                <p style={{ fontSize: '16px', fontWeight: '700', color: '#1a1a1a', margin: 0 }}>
                  1800-XXX-XXXX (Toll Free)
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{
                width: '44px', height: '44px', borderRadius: '12px',
                backgroundColor: '#eff6ff', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
              }}>
                <MdEmail size={20} color="#2563eb" />
              </div>
              <div>
                <p style={{ fontSize: '13px', color: '#9e8e80', margin: '0 0 4px' }}>Email Support</p>
                <p style={{ fontSize: '16px', fontWeight: '700', color: '#1a1a1a', margin: 0 }}>
                  support@Janoni.gov.in
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{
                width: '44px', height: '44px', borderRadius: '12px',
                backgroundColor: '#EEF2FF', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
              }}>
                <MdLocationOn size={20} color="#151A40" />
              </div>
              <div>
                <p style={{ fontSize: '13px', color: '#9e8e80', margin: '0 0 4px' }}>Office Address</p>
                <p style={{ fontSize: '14px', fontWeight: '600', color: '#1a1a1a', margin: 0, lineHeight: 1.5 }}>
                  IGMS Office, Government Building,<br />Bangalore - 560001, Karnataka
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>

    </UserLayout>
  )
}
