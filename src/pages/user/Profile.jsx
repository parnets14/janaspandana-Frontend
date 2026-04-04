import { useState, useEffect } from 'react'
import { MdEdit, MdSave, MdCancel, MdPerson } from 'react-icons/md'
import UserLayout from './UserLayout'
import api from '../../utils/secureApi'

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [user, setUser] = useState(null)
  const [formData, setFormData] = useState({ name: '', address: '' })

  useEffect(() => {
    // Load cached profile immediately to avoid empty flash
    const cached = localStorage.getItem('_userProfile')
    if (cached) {
      const data = JSON.parse(cached)
      setUser(data)
      setFormData({ name: data.name || '', address: data.address || '' })
      setLoading(false)
    }
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const res = await api.get('/auth/me')
      if (res.success && res.data) {
        setUser(res.data)
        setFormData({ name: res.data.name || '', address: res.data.address || '' })
        localStorage.setItem('_userProfile', JSON.stringify(res.data))
      } else {
        // Fall back to cached profile
        const cached = localStorage.getItem('_userProfile')
        if (cached) {
          const data = JSON.parse(cached)
          setUser(data)
          setFormData({ name: data.name || '', address: data.address || '' })
        }
      }
    } catch {
      // Fall back to cached profile on error
      const cached = localStorage.getItem('_userProfile')
      if (cached) {
        const data = JSON.parse(cached)
        setUser(data)
        setFormData({ name: data.name || '', address: data.address || '' })
      }
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await api.put('/auth/me', { name: formData.name, address: formData.address })
      if (res.success) {
        setUser(res.data)
        setFormData({ name: res.data.name || '', address: res.data.address || '' })
        localStorage.setItem('_userProfile', JSON.stringify(res.data))
      }
      setIsEditing(false)
    } catch (err) {
      console.error('Failed to update profile', err)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <UserLayout active="profile">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '300px', color: '#666' }}>
          Loading profile...
        </div>
      </UserLayout>
    )
  }

  const initials = user?.name?.charAt(0)?.toUpperCase() || '?'

  return (
    <UserLayout active="profile" user={user}>
      <div style={{ maxWidth: '800px', margin: '0 auto', paddingTop: '20px' }}>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: '900', color: '#1a1a1a', margin: 0 }}>My Profile</h1>
          {!isEditing && (
            <button onClick={() => setIsEditing(true)} style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '10px 20px', borderRadius: '10px',
              backgroundColor: '#2596be', border: 'none',
              color: '#fff', fontSize: '14px', fontWeight: '600', cursor: 'pointer',
            }}>
              <MdEdit size={18} /> Edit Profile
            </button>
          )}
        </div>

        <div style={{ backgroundColor: '#fff', border: '1px solid #ede5d8', borderRadius: '16px', padding: '32px' }}>

          {/* Profile Photo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '32px', paddingBottom: '28px', borderBottom: '1px solid #ede5d8' }}>
            {user?.photo ? (
              <img src={user.photo} alt={user.name} style={{
                width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover',
                border: '3px solid #2596be'
              }} />
            ) : (
              <div style={{
                width: '80px', height: '80px', borderRadius: '50%',
                backgroundColor: '#2596be', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                fontSize: '36px', color: '#fff', fontWeight: '700',
              }}>
                {initials}
              </div>
            )}
            <div>
              <div style={{ fontSize: '20px', fontWeight: '800', color: '#1a1a1a' }}>{user?.name}</div>
              <div style={{ fontSize: '13px', color: '#9e8e80', marginTop: '4px' }}>
                {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)} •{' '}
                <span style={{ color: user?.isVerified ? '#10b981' : '#ef4444', fontWeight: '600' }}>
                  {user?.isVerified ? '✓ Verified' : '✗ Not Verified'}
                </span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSave}>

            {/* Full Name */}
            <div style={{ marginBottom: '24px' }}>
              <label style={labelStyle}>Full Name</label>
              {isEditing ? (
                <input type="text" value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  style={inputStyle} />
              ) : (
                <p style={valueStyle}>{user?.name || '—'}</p>
              )}
            </div>

            {/* Phone */}
            <div style={{ marginBottom: '24px' }}>
              <label style={labelStyle}>Phone Number</label>
              <p style={{ ...valueStyle, color: '#6b5e52' }}>+91 {user?.phone}</p>
              <p style={{ fontSize: '12px', color: '#9e8e80', marginTop: '4px' }}>Phone number cannot be changed</p>
            </div>

            {/* Aadhaar */}
            <div style={{ marginBottom: '24px' }}>
              <label style={labelStyle}>Aadhaar Number</label>
              <p style={{ ...valueStyle, color: '#6b5e52' }}>
                {user?.maskedAadhaar || (user?.aadhaar ? 'XXXX-XXXX-' + user.aadhaar.slice(-4) : 'XXXX-XXXX-XXXX')}
              </p>
              <p style={{ fontSize: '12px', color: '#9e8e80', marginTop: '4px' }}>Aadhaar number cannot be changed</p>
            </div>

            {/* Address */}
            <div style={{ marginBottom: '24px' }}>
              <label style={labelStyle}>Address</label>
              {isEditing ? (
                <textarea value={formData.address}
                  onChange={e => setFormData({ ...formData, address: e.target.value })}
                  rows={3} style={{ ...inputStyle, resize: 'none', fontFamily: 'inherit', lineHeight: 1.6 }} />
              ) : (
                <p style={valueStyle}>{user?.address || '—'}</p>
              )}
            </div>

            {/* Aadhaar Photo */}
            {user?.aadhaarPhoto && (
              <div style={{ marginBottom: '24px', paddingTop: '24px', borderTop: '1px solid #ede5d8' }}>
                <label style={labelStyle}>Aadhaar Document</label>
                <img src={user.aadhaarPhoto} alt="Aadhaar"
                  style={{ maxWidth: '100%', width: 'auto', maxHeight: '260px', borderRadius: '10px', border: '1px solid #e0d5c8', objectFit: 'contain', display: 'block' }} />
              </div>
            )}

            {/* Dates */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', paddingTop: '24px', borderTop: '1px solid #ede5d8', marginBottom: isEditing ? '24px' : 0 }}>
              <div>
                <label style={labelStyle}>Registered On</label>
                <p style={valueStyle}>{user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }) : '—'}</p>
              </div>
              <div>
                <label style={labelStyle}>Last Login</label>
                <p style={valueStyle}>{user?.lastLogin ? new Date(user.lastLogin).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }) : 'Never'}</p>
              </div>
            </div>

            {isEditing && (
              <div style={{ display: 'flex', gap: '12px', marginTop: '32px' }}>
                <button type="button" onClick={() => setIsEditing(false)} style={{
                  flex: 1, padding: '14px', borderRadius: '12px',
                  backgroundColor: '#f0e8dc', border: '1px solid #e0d5c8',
                  color: '#555', fontSize: '15px', fontWeight: '600',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                }}>
                  <MdCancel size={18} /> Cancel
                </button>
                <button type="submit" disabled={saving} style={{
                  flex: 1, padding: '14px', borderRadius: '12px',
                  backgroundColor: '#41A465', border: 'none',
                  color: '#fff', fontSize: '15px', fontWeight: '600',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                }}>
                  <MdSave size={18} /> {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </UserLayout>
  )
}

const labelStyle = {
  fontSize: '13px', fontWeight: '700', color: '#9e8e80',
  letterSpacing: '0.5px', textTransform: 'uppercase',
  marginBottom: '8px', display: 'block'
}

const valueStyle = {
  fontSize: '16px', fontWeight: '600', color: '#1a1a1a', margin: 0, lineHeight: 1.6
}

const inputStyle = {
  width: '100%', padding: '12px 14px', fontSize: '15px',
  border: '1.5px solid #e0d5c8', borderRadius: '10px',
  backgroundColor: '#faf6f0', outline: 'none', boxSizing: 'border-box'
}
