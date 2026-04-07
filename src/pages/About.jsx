import { motion } from 'framer-motion'
import { MdCheckCircle, MdArrowForward } from 'react-icons/md'
import Navbar from '../components/Navbar'

const mission = [
  { icon: '🌐', title: 'Digital Inclusion', desc: 'Providing an accessible, multilingual, and intuitive platform for all sections of society to report issues.' },
  { icon: '⚙️', title: 'Operational Excellence', desc: 'Automating grievance routing to ensure the right department receives the right information at the right time.' },
  { icon: '⏱️', title: 'Time-Bound Resolution', desc: 'Enforcing strict timelines for service delivery through automated escalation and monitoring.' },
  { icon: '🔒', title: 'Integrity & Trust', desc: 'Building public confidence by maintaining a transparent, "no-tamper" record of every grievance and its resolution.' },
]

const objectives = [
  { num: '01', icon: '🏛️', title: 'Centralized Accessibility', desc: 'A single, unified portal for multiple government departments, eliminating the need for citizens to visit various offices physically.' },
  { num: '02', icon: '📡', title: 'Real-Time Tracking', desc: 'A unique tracking ID for every grievance, offering 24/7 visibility into the status of their request — from submission to final sign-off.' },
  { num: '03', icon: '📊', title: 'Data-Driven Governance', desc: 'Analytical dashboards that identify recurring systemic issues, allowing for proactive policy changes.' },
  { num: '04', icon: '🔄', title: 'Feedback-Loop Integration', desc: 'Citizens can rate the resolution, ensuring that a "closed" ticket truly means a "satisfied" citizen.' },
  { num: '05', icon: '🚨', title: 'Automated Escalation', desc: 'Automatically notifying senior-level officials if a grievance is not addressed within the stipulated SLA.' },
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
              About <span style={{ color: '#60a5fa' }}>Janoni</span>
            </h1>
            <p style={{ fontSize: '17px', color: 'rgba(255,255,255,0.75)', lineHeight: 1.8, maxWidth: '640px', margin: '0 auto' }}>
              A state-of-the-art digital bridge transforming public administration and citizen engagement —
              built on <strong style={{ color: '#fff' }}>transparency</strong>, <strong style={{ color: '#fff' }}>accountability</strong>, and <strong style={{ color: '#fff' }}>rapid response</strong>.
            </p>
          </motion.div>
        </div>
      </div>

      <main style={{ flex: 1, width: '100%', maxWidth: '960px', margin: '0 auto', padding: '64px 24px 80px' }}>

        {/* About Section */}
        <motion.section initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'center', marginBottom: '72px' }}>
          <div>
            <span style={{ fontSize: '11px', fontWeight: '800', color: '#3b82f6', letterSpacing: '2px', textTransform: 'uppercase', display: 'block', marginBottom: '12px' }}>Who We Are</span>
            <h2 style={{ fontSize: '30px', fontWeight: '900', color: '#0f172a', margin: '0 0 16px', lineHeight: 1.25 }}>
              Empowering Every Citizen's Voice
            </h2>
            <p style={{ fontSize: '15px', color: '#475569', lineHeight: 1.8, margin: '0 0 16px' }}>
              Janoni is a unified platform where citizens can voice their grievances directly to the authorities.
              The name reflects our core philosophy: a commitment to <strong style={{ color: '#0f172a' }}>Knowledge (Jana)</strong>, <strong style={{ color: '#0f172a' }}>Innovation</strong>, and <strong style={{ color: '#0f172a' }}>Resolution</strong>.
            </p>
            <p style={{ fontSize: '15px', color: '#475569', lineHeight: 1.8, margin: 0 }}>
              Whether it is infrastructure, public services, or administrative hurdles, Janoni ensures that every issue is tracked, managed, and resolved within a definitive timeframe.
            </p>
          </div>
          <div style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '32px', border: '1px solid #e2e8f0', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {[
                { label: 'Platform Type', value: 'Integrated Grievance Management' },
                { label: 'Coverage', value: 'All Government Departments' },
                { label: 'Availability', value: '24 × 7 Online Access' },
                { label: 'Resolution SLA', value: 'Time-Bound & Monitored' },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '16px', borderBottom: '1px solid #f1f5f9' }}>
                  <span style={{ fontSize: '13px', color: '#94a3b8', fontWeight: '600' }}>{item.label}</span>
                  <span style={{ fontSize: '13px', color: '#0f172a', fontWeight: '700' }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Vision */}
        <motion.section initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          style={{ position: 'relative', overflow: 'hidden', backgroundColor: '#0f172a', borderRadius: '24px', padding: '56px 48px', marginBottom: '72px', textAlign: 'center' }}>
          <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '240px', height: '240px', borderRadius: '50%', backgroundColor: 'rgba(96,165,250,0.06)' }} />
          <div style={{ position: 'absolute', bottom: '-40px', left: '-40px', width: '180px', height: '180px', borderRadius: '50%', backgroundColor: 'rgba(96,165,250,0.04)' }} />
          <span style={{ fontSize: '11px', fontWeight: '800', color: '#60a5fa', letterSpacing: '2px', textTransform: 'uppercase', display: 'block', marginBottom: '20px' }}>Our Vision</span>
          <p style={{ fontSize: 'clamp(18px, 2.5vw, 24px)', fontWeight: '600', color: '#f8fafc', lineHeight: 1.75, margin: '0 auto', maxWidth: '700px', fontStyle: 'italic', position: 'relative', zIndex: 1 }}>
            "To redefine the relationship between the public and the government by fostering a culture of absolute accountability,
            where technology ensures that no citizen's concern goes unheard or unresolved."
          </p>
        </motion.section>

        {/* Mission */}
        <motion.section initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          style={{ marginBottom: '72px' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <span style={{ fontSize: '11px', fontWeight: '800', color: '#3b82f6', letterSpacing: '2px', textTransform: 'uppercase', display: 'block', marginBottom: '12px' }}>Mission</span>
            <h2 style={{ fontSize: '30px', fontWeight: '900', color: '#0f172a', margin: '0 0 12px' }}>What We Stand For</h2>
            <p style={{ fontSize: '15px', color: '#64748b', margin: 0 }}>Our mission is to empower citizens and streamline governance by:</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
            {mission.map((m, i) => (
              <motion.div key={m.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 + i * 0.08 }}
                style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '28px 24px', border: '1px solid #e2e8f0', boxShadow: '0 1px 4px rgba(0,0,0,0.05)', textAlign: 'center' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '16px', backgroundColor: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: '26px' }}>{m.icon}</div>
                <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#0f172a', margin: '0 0 8px' }}>{m.title}</h3>
                <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.65, margin: 0 }}>{m.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Objectives */}
        <motion.section initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          style={{ marginBottom: '72px' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <span style={{ fontSize: '11px', fontWeight: '800', color: '#3b82f6', letterSpacing: '2px', textTransform: 'uppercase', display: 'block', marginBottom: '12px' }}>Objectives</span>
            <h2 style={{ fontSize: '30px', fontWeight: '900', color: '#0f172a', margin: '0 0 12px' }}>Five Key Pillars</h2>
            <p style={{ fontSize: '15px', color: '#64748b', margin: 0 }}>The Janoni application is built around these core objectives:</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {objectives.map((o, i) => (
              <motion.div key={o.title} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.45 + i * 0.07 }}
                style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', backgroundColor: '#fff', borderRadius: '16px', padding: '24px', border: '1px solid #e2e8f0', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '48px', height: '48px', borderRadius: '14px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', flexShrink: 0, fontSize: '22px' }}>{o.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                    <span style={{ fontSize: '11px', fontWeight: '800', color: '#cbd5e1', letterSpacing: '1px' }}>{o.num}</span>
                    <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#0f172a', margin: 0 }}>{o.title}</h3>
                  </div>
                  <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.65, margin: 0 }}>{o.desc}</p>
                </div>
                <MdCheckCircle size={22} color="#22c55e" style={{ flexShrink: 0, marginTop: '2px' }} />
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* CTA */}
        <motion.section initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
          style={{ backgroundColor: '#fff', borderRadius: '24px', padding: '56px 48px', border: '1px solid #e2e8f0', boxShadow: '0 4px 24px rgba(0,0,0,0.06)', textAlign: 'center' }}>
          <h3 style={{ fontSize: '28px', fontWeight: '900', color: '#0f172a', margin: '0 0 12px' }}>Ready to Make Your Voice Heard?</h3>
          <p style={{ fontSize: '15px', color: '#64748b', margin: '0 0 28px', lineHeight: 1.7 }}>
            Join thousands of citizens who have successfully resolved their grievances through Janoni.
          </p>
          <motion.button whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}
            onClick={() => window.location.href = '/'}
            style={{ padding: '15px 40px', borderRadius: '12px', backgroundColor: '#0f172a', color: '#fff', fontSize: '15px', fontWeight: '700', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '10px', boxShadow: '0 4px 16px rgba(15,23,42,0.25)' }}>
            Get Started <MdArrowForward size={18} />
          </motion.button>
        </motion.section>

      </main>

      <footer style={{ borderTop: '1px solid #e2e8f0', padding: '24px 32px', backgroundColor: '#fff', textAlign: 'center' }}>
        <span style={{ fontSize: '13px', color: '#94a3b8' }}>© 2024 Janoni — Integrated Grievance Management System. All rights reserved.</span>
      </footer>
    </div>
  )
}
