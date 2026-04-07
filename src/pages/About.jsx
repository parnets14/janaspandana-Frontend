import { motion } from 'framer-motion'
import { MdCheckCircle, MdArrowForward, MdLanguage, MdSettings, MdTimer, MdVerifiedUser, MdAccountBalance, MdTrackChanges, MdBarChart, MdLoop, MdNotificationsActive } from 'react-icons/md'
import Navbar from '../components/Navbar'

const mission = [
  { Icon: MdLanguage,          color: '#3b82f6', bg: '#eff6ff', title: 'Digital Inclusion',       desc: 'Providing an accessible, multilingual, and intuitive platform for all sections of society to report issues.' },
  { Icon: MdSettings,          color: '#8b5cf6', bg: '#f5f3ff', title: 'Operational Excellence',  desc: 'Automating grievance routing to ensure the right department receives the right information at the right time.' },
  { Icon: MdTimer,             color: '#f59e0b', bg: '#fffbeb', title: 'Time-Bound Resolution',   desc: 'Enforcing strict timelines for service delivery through automated escalation and monitoring.' },
  { Icon: MdVerifiedUser,      color: '#10b981', bg: '#ecfdf5', title: 'Integrity & Trust',       desc: 'Building public confidence by maintaining a transparent, "no-tamper" record of every grievance and its resolution.' },
]

const objectives = [
  { num: '01', Icon: MdAccountBalance,       color: '#3b82f6', bg: '#eff6ff', title: 'Centralized Accessibility',   desc: 'A single, unified portal for multiple government departments, eliminating the need for citizens to visit various offices physically.' },
  { num: '02', Icon: MdTrackChanges,         color: '#8b5cf6', bg: '#f5f3ff', title: 'Real-Time Tracking',          desc: 'A unique tracking ID for every grievance, offering 24/7 visibility into the status of their request — from submission to final sign-off.' },
  { num: '03', Icon: MdBarChart,             color: '#f59e0b', bg: '#fffbeb', title: 'Data-Driven Governance',      desc: 'Analytical dashboards that identify recurring systemic issues, allowing for proactive policy changes.' },
  { num: '04', Icon: MdLoop,                 color: '#10b981', bg: '#ecfdf5', title: 'Feedback-Loop Integration',   desc: 'Citizens can rate the resolution, ensuring that a "closed" ticket truly means a "satisfied" citizen.' },
  { num: '05', Icon: MdNotificationsActive,  color: '#ef4444', bg: '#fef2f2', title: 'Automated Escalation',        desc: 'Automatically notifying senior-level officials if a grievance is not addressed within the stipulated SLA.' },
]

export default function About() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', fontFamily: "system-ui,'Segoe UI',Roboto,sans-serif", display: 'flex', flexDirection: 'column' }}>
      <Navbar variant="back" />

      {/* Hero Banner */}
      <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 60%, #151A40 100%)', padding: '72px 24px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', backgroundColor: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '999px', padding: '6px 18px 6px 6px', marginBottom: '28px' }}>
              <img src="/logo.jpeg" alt="Janoni" style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
              <span style={{ fontSize: '13px', fontWeight: '600', color: 'rgba(255,255,255,0.9)' }}>Official Grievance Portal</span>
            </div>
            <h1 style={{ fontSize: 'clamp(36px, 5vw, 56px)', fontWeight: '900', color: '#fff', margin: '0 0 20px', lineHeight: 1.1 }}>
              About <span style={{ color: '#60a5fa' }}>JaNoNi</span>
            </h1>
            <p style={{ fontSize: '17px', color: 'rgba(255,255,255,0.75)', lineHeight: 1.8, maxWidth: '640px', margin: '0 auto' }}>
              A state-of-the-art digital bridge transforming public administration and citizen engagement —
              built on <strong style={{ color: '#fff' }}>transparency</strong>, <strong style={{ color: '#fff' }}>accountability</strong>, and <strong style={{ color: '#fff' }}>rapid response</strong>.
            </p>
          </motion.div>
        </div>
      </div>

      <main style={{ flex: 1, width: '100%', maxWidth: '960px', margin: '0 auto', padding: '64px 24px 80px' }}>

        {/* About Section - centered */}
        <motion.section initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 72px' }}>
          <h2 style={{ fontSize: '32px', fontWeight: '900', color: '#0f172a', margin: '0 0 20px', lineHeight: 1.25 }}>About JaNoNi</h2>
          <p style={{ fontSize: '16px', color: '#475569', lineHeight: 1.85, margin: '0 0 16px' }}>
            JaNoNi is a unified platform where citizens can voice their grievances directly to the authorities.
            The name reflects our core philosophy: a commitment to <strong style={{ color: '#0f172a' }}>Knowledge (Jana)</strong>, <strong style={{ color: '#0f172a' }}>Innovation</strong>, and <strong style={{ color: '#0f172a' }}>Resolution</strong>.
          </p>
          <p style={{ fontSize: '16px', color: '#475569', lineHeight: 1.85, margin: 0 }}>
            By integrating modern web technologies with structured administrative workflows, JaNoNi moves beyond mere complaint registration — it ensures that every issue is tracked, managed, and resolved within a definitive timeframe. Whether it is infrastructure, public services, or administrative hurdles, JaNoNi empowers the common man to participate in the betterment of their community with just a few clicks.
          </p>
        </motion.section>

        {/* Vision */}
        <motion.section initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          style={{ textAlign: 'center', marginBottom: '72px', padding: '0 24px' }}>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: '900', color: '#0f172a', margin: '0 0 24px' }}>Our Vision</h2>
          <p style={{ fontSize: 'clamp(17px, 2.2vw, 22px)', fontWeight: '500', color: '#475569', lineHeight: 1.8, margin: '0 auto', maxWidth: '720px', fontStyle: 'italic' }}>
            "To redefine the relationship between the public and the government by fostering a culture of absolute accountability,
            where technology ensures that no citizen's concern goes unheard or unresolved."
          </p>
        </motion.section>

        {/* Mission */}
        <motion.section initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          style={{ marginBottom: '72px' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: '900', color: '#0f172a', margin: '0 0 10px' }}>Our Mission</h2>
            <p style={{ fontSize: '15px', color: '#64748b', margin: 0 }}>Our mission is to empower citizens and streamline governance by:</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '18px' }}>
            {mission.map((m, i) => (
              <motion.div key={m.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 + i * 0.08 }}
                style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '28px 22px', border: '1px solid #e2e8f0', boxShadow: '0 1px 4px rgba(0,0,0,0.05)', textAlign: 'center' }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)'}
                onMouseLeave={e => e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.05)'}>
                <div style={{ width: '52px', height: '52px', borderRadius: '14px', backgroundColor: m.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
                  <m.Icon size={26} color={m.color} />
                </div>
                <h3 style={{ fontSize: '14px', fontWeight: '800', color: '#0f172a', margin: '0 0 8px' }}>{m.title}</h3>
                <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.65, margin: 0 }}>{m.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Objectives */}
        <motion.section initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          style={{ marginBottom: '72px' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: '900', color: '#0f172a', margin: '0 0 10px' }}>Our Objectives</h2>
            <p style={{ fontSize: '15px', color: '#64748b', margin: 0 }}>The JaNoNi application is built around these core objectives:</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {objectives.map((o, i) => (
              <motion.div key={o.title} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.45 + i * 0.07 }}
                style={{ display: 'flex', gap: '18px', alignItems: 'flex-start', backgroundColor: '#fff', borderRadius: '16px', padding: '22px 24px', border: '1px solid #e2e8f0', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '46px', height: '46px', borderRadius: '12px', backgroundColor: o.bg, flexShrink: 0 }}>
                  <o.Icon size={22} color={o.color} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px' }}>
                    <span style={{ fontSize: '10px', fontWeight: '800', color: '#cbd5e1', letterSpacing: '1px' }}>{o.num}</span>
                    <h3 style={{ fontSize: '14px', fontWeight: '800', color: '#0f172a', margin: 0 }}>{o.title}</h3>
                  </div>
                  <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.65, margin: 0 }}>{o.desc}</p>
                </div>
                <MdCheckCircle size={20} color="#22c55e" style={{ flexShrink: 0, marginTop: '3px' }} />
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* CTA */}
        <motion.section initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
          style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)', borderRadius: '24px', padding: '52px 48px', textAlign: 'center' }}>
          <h3 style={{ fontSize: '26px', fontWeight: '900', color: '#fff', margin: '0 0 12px' }}>Ready to Make Your Voice Heard?</h3>
          <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.7)', margin: '0 0 28px', lineHeight: 1.7 }}>
            Join thousands of citizens who have successfully resolved their grievances through JaNoNi.
          </p>
          <motion.button whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}
            onClick={() => window.location.href = '/'}
            style={{ padding: '14px 36px', borderRadius: '12px', backgroundColor: '#fff', color: '#0f172a', fontSize: '15px', fontWeight: '800', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 16px rgba(0,0,0,0.2)' }}>
            Get Started <MdArrowForward size={18} />
          </motion.button>
        </motion.section>

      </main>

      <footer style={{ borderTop: '1px solid #e2e8f0', padding: '24px 32px', backgroundColor: '#fff', textAlign: 'center' }}>
        <span style={{ fontSize: '13px', color: '#94a3b8' }}>© {new Date().getFullYear()} JaNoNi — Integrated Grievance Management System. All rights reserved.</span>
      </footer>
    </div>
  )
}
