import { motion } from 'framer-motion'
import { MdCheckCircle, MdArrowForward, MdLanguage, MdSettings, MdTimer, MdVerifiedUser, MdAccountBalance, MdTrackChanges, MdBarChart, MdLoop, MdNotificationsActive } from 'react-icons/md'
import UserLayout from './UserLayout'

const mission = [
  { Icon: MdLanguage,         color: '#3b82f6', bg: '#eff6ff', title: 'Digital Inclusion',      desc: 'Providing an accessible, multilingual, and intuitive platform for all sections of society to report issues.' },
  { Icon: MdSettings,         color: '#8b5cf6', bg: '#f5f3ff', title: 'Operational Excellence', desc: 'Automating grievance routing to ensure the right department receives the right information at the right time.' },
  { Icon: MdTimer,            color: '#f59e0b', bg: '#fffbeb', title: 'Time-Bound Resolution',  desc: 'Enforcing strict timelines for service delivery through automated escalation and monitoring.' },
  { Icon: MdVerifiedUser,     color: '#10b981', bg: '#ecfdf5', title: 'Integrity & Trust',      desc: 'Building public confidence by maintaining a transparent, "no-tamper" record of every grievance and its resolution.' },
]

const objectives = [
  { num: '01', Icon: MdAccountBalance,      color: '#3b82f6', bg: '#eff6ff', title: 'Centralized Accessibility',  desc: 'A single, unified portal for multiple government departments, eliminating the need for citizens to visit various offices physically.' },
  { num: '02', Icon: MdTrackChanges,        color: '#8b5cf6', bg: '#f5f3ff', title: 'Real-Time Tracking',         desc: 'A unique tracking ID for every grievance, offering 24/7 visibility into the status of their request — from submission to final sign-off.' },
  { num: '03', Icon: MdBarChart,            color: '#f59e0b', bg: '#fffbeb', title: 'Data-Driven Governance',     desc: 'Analytical dashboards that identify recurring systemic issues, allowing for proactive policy changes.' },
  { num: '04', Icon: MdLoop,                color: '#10b981', bg: '#ecfdf5', title: 'Feedback-Loop Integration',  desc: 'Citizens can rate the resolution, ensuring that a "closed" ticket truly means a "satisfied" citizen.' },
  { num: '05', Icon: MdNotificationsActive, color: '#ef4444', bg: '#fef2f2', title: 'Automated Escalation',       desc: 'Automatically notifying senior-level officials if a grievance is not addressed within the stipulated SLA.' },
]

export default function About() {
  return (
    <UserLayout active="about">
      <div style={{ maxWidth: '860px', margin: '0 auto' }}>

        {/* Page Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          style={{ marginBottom: '48px', textAlign: 'center' }}>
          <h1 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: '900', color: '#0f172a', margin: '0 0 16px', lineHeight: 1.2 }}>About JaNoNi</h1>
          <p style={{ fontSize: '16px', color: '#475569', lineHeight: 1.8, maxWidth: '680px', margin: '0 auto 12px' }}>
            A state-of-the-art digital bridge transforming public administration and citizen engagement —
            built on <strong style={{ color: '#0f172a' }}>transparency</strong>, <strong style={{ color: '#0f172a' }}>accountability</strong>, and <strong style={{ color: '#0f172a' }}>rapid response</strong>.
          </p>
          <p style={{ fontSize: '15px', color: '#64748b', lineHeight: 1.8, maxWidth: '680px', margin: '0 auto' }}>
            The name reflects our core philosophy: <strong style={{ color: '#151A40' }}>Knowledge (Jana)</strong>, <strong style={{ color: '#151A40' }}>Innovation</strong>, and <strong style={{ color: '#151A40' }}>Resolution</strong>.
            Whether it is infrastructure, public services, or administrative hurdles, JaNoNi empowers the common man to participate in the betterment of their community with just a few clicks.
          </p>
        </motion.div>

        {/* Vision */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          style={{ textAlign: 'center', marginBottom: '48px', padding: '0 16px' }}>
          <h2 style={{ fontSize: 'clamp(26px, 4vw, 38px)', fontWeight: '900', color: '#0f172a', margin: '0 0 20px' }}>Our Vision</h2>
          <p style={{ fontSize: 'clamp(16px, 2vw, 20px)', fontWeight: '500', color: '#475569', lineHeight: 1.8, margin: '0 auto', maxWidth: '680px', fontStyle: 'italic' }}>
            "To redefine the relationship between the public and the government by fostering a culture of absolute accountability,
            where technology ensures that no citizen's concern goes unheard or unresolved."
          </p>
        </motion.div>

        {/* Mission */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          style={{ marginBottom: '48px' }}>
          <span style={{ fontSize: '11px', fontWeight: '800', color: '#3b82f6', letterSpacing: '2px', textTransform: 'uppercase', display: 'none', marginBottom: '10px' }}>Mission</span>
          <h2 style={{ fontSize: 'clamp(26px, 4vw, 38px)', fontWeight: '900', color: '#0f172a', margin: '0 0 8px', textAlign: 'center' }}>Our Mission</h2>
          <p style={{ fontSize: '14px', color: '#64748b', margin: '0 0 24px', textAlign: 'center' }}>Our mission is to empower citizens and streamline governance by:</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
            {mission.map((m, i) => (
              <motion.div key={m.title} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.08 }}
                style={{ backgroundColor: '#fff', borderRadius: '14px', padding: '24px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', textAlign: 'center' }}>
                <div style={{ width: '52px', height: '52px', borderRadius: '14px', backgroundColor: m.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
                  <m.Icon size={26} color={m.color} />
                </div>
                <h3 style={{ fontSize: '14px', fontWeight: '800', color: '#0f172a', margin: '0 0 6px' }}>{m.title}</h3>
                <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.6, margin: 0 }}>{m.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Objectives */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
          style={{ marginBottom: '48px' }}>
          <span style={{ display: 'none' }}>Objectives</span>
          <h2 style={{ fontSize: 'clamp(26px, 4vw, 38px)', fontWeight: '900', color: '#0f172a', margin: '0 0 8px', textAlign: 'center' }}>Our Objectives</h2>
          <p style={{ fontSize: '14px', color: '#64748b', margin: '0 0 20px', textAlign: 'center' }}>The JaNoNi application is built around these core objectives:</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {objectives.map((o, i) => (
              <motion.div key={o.title} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 + i * 0.07 }}
                style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', backgroundColor: '#fff', borderRadius: '14px', padding: '20px 22px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: o.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <o.Icon size={22} color={o.color} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{ fontSize: '10px', fontWeight: '800', color: '#cbd5e1', letterSpacing: '1px' }}>{o.num}</span>
                    <h3 style={{ fontSize: '14px', fontWeight: '800', color: '#0f172a', margin: 0 }}>{o.title}</h3>
                  </div>
                  <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.6, margin: 0 }}>{o.desc}</p>
                </div>
                <MdCheckCircle size={20} color="#22c55e" style={{ flexShrink: 0, marginTop: '2px' }} />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}
          style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '44px', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', textAlign: 'center' }}>
          <h3 style={{ fontSize: '24px', fontWeight: '900', color: '#0f172a', margin: '0 0 10px' }}>Ready to Submit Your Complaint?</h3>
          <p style={{ fontSize: '14px', color: '#64748b', margin: '0 0 24px', lineHeight: 1.7 }}>
            Join thousands of citizens who have successfully resolved their grievances through JaNoNi.
          </p>
          <motion.button whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}
            onClick={() => window.location.href = '/user/submit'}
            style={{ padding: '13px 36px', borderRadius: '12px', backgroundColor: '#0f172a', color: '#fff', fontSize: '14px', fontWeight: '700', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 14px rgba(15,23,42,0.2)' }}>
            Submit Complaint <MdArrowForward size={16} />
          </motion.button>
        </motion.div>

      </div>
    </UserLayout>
  )
}
