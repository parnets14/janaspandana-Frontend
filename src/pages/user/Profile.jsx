import { useState } from 'react'
import { MdEdit, MdSave, MdCancel } from 'react-icons/md'
import UserLayout from './UserLayout'

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false)
  const [language, setLanguage] = useState('english') // 'english' | 'kannada'
  const [formData, setFormData] = useState({
    name: 'Kiran',
    phone: '9876543210',
    aadhaar: '123456789012',
    address: 'Sector 4, Main Grid, Bangalore',
    photo: null
  })

  const handleSave = (e) => {
    e.preventDefault()
    setIsEditing(false)
    // Save logic here
  }

  return (
    <UserLayout active="profile">
      <div style={{ maxWidth: '800px', margin: '0 auto', paddingTop: '20px' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: '900', color: '#1a1a1a', margin: 0 }}>
            My Profile
          </h1>
          {!isEditing ? (
            <button 
              onClick={() => setIsEditing(true)}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '10px 20px', borderRadius: '10px',
                backgroundColor: '#2596be', border: 'none',
                color: '#fff', fontSize: '14px', fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              <MdEdit size={18} /> Edit Profile
            </button>
          ) : null}
        </div>

        <div style={{
          backgroundColor: '#fff', border: '1px solid #ede5d8',
          borderRadius: '16px', padding: '32px',
        }}>
          
          {/* Profile Photo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '32px', paddingBottom: '28px', borderBottom: '1px solid #ede5d8' }}>
            <div style={{
              width: '80px', height: '80px', borderRadius: '50%',
              backgroundColor: '#2596be', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              fontSize: '36px', color: '#fff', fontWeight: '700',
            }}>
              K
            </div>
            {isEditing && (
              <div>
                <label style={{
                  display: 'inline-block', padding: '10px 18px',
                  borderRadius: '10px', backgroundColor: '#faf6f0',
                  border: '1.5px solid #e0d5c8', cursor: 'pointer',
                  fontSize: '14px', fontWeight: '600', color: '#555',
                }}>
                  Change Photo
                  <input type="file" accept="image/*" style={{ display: 'none' }} />
                </label>
              </div>
            )}
          </div>

          <form onSubmit={handleSave}>
            
            <div style={{ marginBottom: '24px' }}>
              <label style={{ fontSize: '13px', fontWeight: '700', color: '#9e8e80', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>
                Full Name
              </label>
              {isEditing ? (
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  style={{
                    width: '100%', padding: '12px 14px', fontSize: '15px',
                    border: '1.5px solid #e0d5c8', borderRadius: '10px',
                    backgroundColor: '#faf6f0', outline: 'none',
                  }}
                />
              ) : (
                <p style={{ fontSize: '16px', fontWeight: '600', color: '#1a1a1a', margin: 0 }}>
                  {formData.name}
                </p>
              )}
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ fontSize: '13px', fontWeight: '700', color: '#9e8e80', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>
                Phone Number
              </label>
              <p style={{ fontSize: '16px', fontWeight: '600', color: '#6b5e52', margin: 0 }}>
                +91 {formData.phone}
              </p>
              <p style={{ fontSize: '12px', color: '#9e8e80', marginTop: '4px' }}>
                Phone number cannot be changed
              </p>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ fontSize: '13px', fontWeight: '700', color: '#9e8e80', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>
                Aadhaar Number
              </label>
              <p style={{ fontSize: '16px', fontWeight: '600', color: '#6b5e52', margin: 0 }}>
                {formData.aadhaar.replace(/(\d{4})(\d{4})(\d{4})/, '$1 $2 $3')}
              </p>
              <p style={{ fontSize: '12px', color: '#9e8e80', marginTop: '4px' }}>
                Aadhaar number cannot be changed
              </p>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ fontSize: '13px', fontWeight: '700', color: '#9e8e80', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>
                Address
              </label>
              {isEditing ? (
                <textarea 
                  value={formData.address}
                  onChange={e => setFormData({...formData, address: e.target.value})}
                  rows={3}
                  style={{
                    width: '100%', padding: '12px 14px', fontSize: '15px',
                    border: '1.5px solid #e0d5c8', borderRadius: '10px',
                    backgroundColor: '#faf6f0', outline: 'none',
                    fontFamily: 'inherit', resize: 'none',
                  }}
                />
              ) : (
                <p style={{ fontSize: '16px', fontWeight: '600', color: '#1a1a1a', margin: 0, lineHeight: 1.6 }}>
                  {formData.address}
                </p>
              )}
            </div>

            <div style={{ marginBottom: '24px', paddingTop: '24px', borderTop: '1px solid #ede5d8' }}>
              <label style={{ fontSize: '13px', fontWeight: '700', color: '#9e8e80', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '12px', display: 'block' }}>
                Language Preference
              </label>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => setLanguage('english')}
                  style={{
                    flex: 1, padding: '14px', borderRadius: '12px',
                    border: '1.5px solid',
                    borderColor: language === 'english' ? '#2596be' : '#e0d5c8',
                    backgroundColor: language === 'english' ? '#fef0e6' : '#fff',
                    color: language === 'english' ? '#2596be' : '#6b5e52',
                    fontSize: '15px', fontWeight: '700', cursor: 'pointer',
                  }}
                >
                  🇬🇧 English
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage('kannada')}
                  style={{
                    flex: 1, padding: '14px', borderRadius: '12px',
                    border: '1.5px solid',
                    borderColor: language === 'kannada' ? '#2596be' : '#e0d5c8',
                    backgroundColor: language === 'kannada' ? '#fef0e6' : '#fff',
                    color: language === 'kannada' ? '#2596be' : '#6b5e52',
                    fontSize: '15px', fontWeight: '700', cursor: 'pointer',
                  }}
                >
                  🇮🇳 ಕನ್ನಡ
                </button>
              </div>
              <p style={{ fontSize: '12px', color: '#9e8e80', marginTop: '8px' }}>
                Select your preferred language for the interface
              </p>
            </div>

            {isEditing && (
              <div style={{ display: 'flex', gap: '12px', marginTop: '32px' }}>
                <button 
                  type="button"
                  onClick={() => setIsEditing(false)}
                  style={{
                    flex: 1, padding: '14px', borderRadius: '12px',
                    backgroundColor: '#f0e8dc', border: '1px solid #e0d5c8',
                    color: '#555', fontSize: '15px', fontWeight: '600',
                    cursor: 'pointer', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', gap: '8px',
                  }}
                >
                  <MdCancel size={18} /> Cancel
                </button>
                <button 
                  type="submit"
                  style={{
                    flex: 1, padding: '14px', borderRadius: '12px',
                    backgroundColor: '#41A465', border: 'none',
                    color: '#fff', fontSize: '15px', fontWeight: '600',
                    cursor: 'pointer', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', gap: '8px',
                  }}
                >
                  <MdSave size={18} /> Save Changes
                </button>
              </div>
            )}
          </form>

        </div>
      </div>
    </UserLayout>
  )
}
