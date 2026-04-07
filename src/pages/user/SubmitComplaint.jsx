import { useState, useRef, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { MdArrowForward, MdUpload, MdLocationOn, MdAgriculture, MdSchool, MdLocalHospital, MdLocalPolice, MdAccountBalance, MdConstruction, MdWaterDrop, MdDelete, MdPark, MdTitle, MdDescription, MdCamera, MdClose, MdFlipCameraAndroid, MdBusiness, MdElectricBolt, MdDirectionsBus, MdHomeWork, MdForest, MdSecurity } from 'react-icons/md'
import { RiGovernmentLine } from 'react-icons/ri'
import UserLayout from './UserLayout'
import { departmentAPI, complaintAPI } from '../../utils/secureApi'

// Map icon key strings (stored in DB) to actual react-icon components
const ICON_MAP = {
  MdAgriculture, MdSchool, MdLocalHospital, MdLocalPolice,
  MdAccountBalance, MdConstruction, MdWaterDrop, MdDelete,
  MdPark, MdBusiness, MdElectricBolt, MdDirectionsBus,
  MdHomeWork, MdForest, MdSecurity
}

const CITIES = [
  'Raichur City Municipal Council (CMC)',
  'Sindhanur (CMC)',
  'Manvi (TMC)',
  'Lingasugur (TMC)',
  'Devadurga (TMC)',
  'Maski (TMC)',
  'Sirwar (Town Panchayat)',
  'Kavital (Town Panchayat)',
]

const WARDS = Array.from({ length: 35 }, (_, i) => `Ward ${i + 1}`)

export default function SubmitComplaint() {
  const navigate = useNavigate()
  const [departments, setDepartments] = useState([])
  const [dept, setDept] = useState('')
  const [city, setCity] = useState('')
  const [ward, setWard] = useState('')
  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState('')
  const [proofFiles, setProofFiles] = useState([])
  const [showUploadMenu, setShowUploadMenu] = useState(false)
  const [showCamera, setShowCamera] = useState(false)
  const [facingMode, setFacingMode] = useState('environment')
  const [cameraError, setCameraError] = useState('')
  const [location, setLocation] = useState('')
  const [locationCoords, setLocationCoords] = useState(null)
  const [locationLoading, setLocationLoading] = useState(false)
  const [locationError, setLocationError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const fileInputRef = useRef(null)
  const videoRef = useRef(null)
  const streamRef = useRef(null)

  // Load Google Maps JS API once (async pattern)
  useEffect(() => {
    const key = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
    if (!key || window.google?.maps) return
    if (document.getElementById('gmaps-script')) return
    const script = document.createElement('script')
    script.id = 'gmaps-script'
    script.src = `https://maps.googleapis.com/maps/api/js?key=${key}&loading=async&callback=Function.prototype`
    script.async = true
    script.defer = true
    document.head.appendChild(script)
  }, [])

  // Fetch departments from backend
  useEffect(() => {
    departmentAPI.getAll()
      .then(res => {
        setDepartments(res.data)
        if (res.data.length > 0) setDept(res.data[0].name)
      })
      .catch(() => {}) // silently fail, form still usable
  }, [])

  const startCamera = useCallback(async (facing = facingMode) => {
    setCameraError('')
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop())
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: facing, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false
      })
      streamRef.current = stream
      if (videoRef.current) videoRef.current.srcObject = stream
    } catch (err) {
      setCameraError('Camera access denied or not available.')
    }
  }, [facingMode])

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop())
      streamRef.current = null
    }
  }, [])

  const openCamera = () => {
    setShowCamera(true)
    setShowUploadMenu(false)
    setTimeout(() => startCamera(facingMode), 100)
  }

  const closeCamera = () => {
    stopCamera()
    setShowCamera(false)
    setCameraError('')
  }

  const flipCamera = () => {
    const next = facingMode === 'environment' ? 'user' : 'environment'
    setFacingMode(next)
    startCamera(next)
  }

  const capturePhoto = () => {
    if (!videoRef.current) return
    const canvas = document.createElement('canvas')
    canvas.width = videoRef.current.videoWidth
    canvas.height = videoRef.current.videoHeight
    canvas.getContext('2d').drawImage(videoRef.current, 0, 0)
    canvas.toBlob(blob => {
      if (!blob) return
      const file = new File([blob], `photo_${Date.now()}.jpg`, { type: 'image/jpeg' })
      setProofFiles(prev => [...prev, file].slice(0, 5))
      closeCamera()
    }, 'image/jpeg', 0.92)
  }

  const detectLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation not supported by your browser.')
      return
    }
    setLocationLoading(true)
    setLocationError('')
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const { latitude, longitude } = coords
        setLocationCoords({ lat: latitude, lng: longitude })

        const doGeocode = () => {
          if (window.google && window.google.maps) {
            const geocoder = new window.google.maps.Geocoder()
            geocoder.geocode({ location: { lat: latitude, lng: longitude } }, (results, status) => {
              setLocationLoading(false)
              if (status === 'OK' && results[0]) {
                setLocation(results[0].formatted_address)
              } else {
                setLocationError('Could not retrieve address. Coordinates saved.')
              }
            })
          } else {
            // Maps JS API not loaded yet, fall back to direct fetch
            const key = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
            fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${key}`)
              .then(r => r.json())
              .then(data => {
                if (data.status === 'OK' && data.results[0]) {
                  setLocation(data.results[0].formatted_address)
                } else {
                  setLocationError(`Address lookup failed (${data.status}). Coordinates saved.`)
                }
              })
              .catch(() => setLocationError('Address lookup failed. Coordinates saved.'))
              .finally(() => setLocationLoading(false))
          }
        }

        // Wait up to 3s for Maps API to load, then proceed
        if (window.google?.maps) {
          doGeocode()
        } else {
          const script = document.getElementById('gmaps-script')
          if (script) {
            script.addEventListener('load', doGeocode, { once: true })
            setTimeout(() => { if (locationLoading) doGeocode() }, 3000)
          } else {
            doGeocode()
          }
        }
      },
      () => {
        setLocationLoading(false)
        setLocationError('Location access denied. Please allow location permission.')
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files)
    setProofFiles(prev => [...prev, ...files].slice(0, 5))
    e.target.value = ''
  }

  const removeFile = (index) => {
    setProofFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitError('')
    setSubmitting(true)
    try {
      const res = await complaintAPI.submit({
        department: dept,
        title,
        description: desc,
        location: {
          address: location,
          city,
          ward,
          lat: locationCoords?.lat || null,
          lng: locationCoords?.lng || null
        }
      })

      // Upload proof files if any
      if (proofFiles.length > 0 && res.data?._id) {
        await complaintAPI.uploadPhotos(res.data._id, proofFiles)
      }

      navigate('/user/complaints')
    } catch (err) {
      setSubmitError(err.message || 'Failed to submit complaint. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <UserLayout active="complaints">
      <div style={{ maxWidth: '860px' }}>

        {/* Page title */}
        <div style={{ marginBottom: '36px' }}>
          <button
            type="button"
            onClick={() => navigate(-1)}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', cursor: 'pointer', color: '#6b5e52', fontSize: '15px', fontWeight: '600', padding: '0 0 14px', marginLeft: '-4px' }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
            Back
          </button>
          <h1 style={{ fontSize: 'clamp(24px, 5vw, 36px)', fontWeight: '900', color: '#1a1a1a', margin: '0 0 10px', lineHeight: 1.2 }}>
            New Resolution
          </h1>
          <p style={{ fontSize: 'clamp(14px, 2.5vw, 16px)', color: '#6b5e52', margin: 0, lineHeight: 1.6 }}>
            Share your concern with us. Our concierge team is here to ensure transparency and accountability.
          </p>
        </div>

        <div className="submit-form-card" style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '40px', border: '1px solid #E5E7EB', boxShadow: '0 4px 24px rgba(0,0,0,0.05)' }}>
          <form onSubmit={handleSubmit}>

            {/* Department */}
            <div style={{ marginBottom: '32px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '15px', fontWeight: '700', color: '#1a1a1a', marginBottom: '14px' }}>
                <RiGovernmentLine size={18} color="#151A40" /> Select Department
              </label>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {departments.map(d => {
                  const Icon = ICON_MAP[d.icon] || MdAccountBalance
                  return (
                    <button key={d._id || d.name} type="button" onClick={() => setDept(d.name)} style={{
                      padding: '9px 16px', borderRadius: '999px', border: '1.5px solid',
                      borderColor: dept === d.name ? '#151A40' : '#E5E7EB',
                      backgroundColor: dept === d.name ? '#151A40' : '#fff',
                      color: dept === d.name ? '#fff' : '#555',
                      fontSize: '14px', fontWeight: '600', cursor: 'pointer',
                      transition: 'all 0.15s',
                      display: 'flex', alignItems: 'center', gap: '6px',
                    }}>
                      <Icon size={16} />
                      {d.name}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* City + Ward */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '32px' }}>
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '15px', fontWeight: '700', color: '#1a1a1a', marginBottom: '10px' }}>
                  <MdLocationOn size={18} color="#151A40" /> City / Town
                </label>
                <select value={city} onChange={e => setCity(e.target.value)} required
                  style={{ width: '100%', padding: '13px 14px', borderRadius: '12px', border: '1.5px solid #E5E7EB', backgroundColor: '#F8F9FA', fontSize: '14px', color: city ? '#1a1a1a' : '#9ca3af', outline: 'none', cursor: 'pointer', boxSizing: 'border-box' }}>
                  <option value="">Select city / town</option>
                  {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '15px', fontWeight: '700', color: '#1a1a1a', marginBottom: '10px' }}>
                  <MdHomeWork size={18} color="#151A40" /> Ward
                </label>
                <select value={ward} onChange={e => setWard(e.target.value)} required
                  style={{ width: '100%', padding: '13px 14px', borderRadius: '12px', border: '1.5px solid #E5E7EB', backgroundColor: '#F8F9FA', fontSize: '14px', color: ward ? '#1a1a1a' : '#9ca3af', outline: 'none', cursor: 'pointer', boxSizing: 'border-box' }}>
                  <option value="">Select ward</option>
                  {WARDS.map(w => <option key={w} value={w}>{w}</option>)}
                </select>
              </div>
            </div>

            {/* Two column: title + description */}
            <div className="submit-two-col">
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '15px', fontWeight: '700', color: '#1a1a1a', marginBottom: '10px' }}>
                  <MdTitle size={18} color="#151A40" /> Complaint Title
                </label>
                <input
                  type="text" value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="Brief summary of the issue"
                  required
                  style={{
                    width: '100%', padding: '14px 16px', borderRadius: '12px',
                    border: '1.5px solid #E5E7EB', backgroundColor: '#F8F9FA',
                    fontSize: '14px', color: '#1a1a1a', outline: 'none', boxSizing: 'border-box',
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '15px', fontWeight: '700', color: '#1a1a1a', marginBottom: '10px' }}>
                  <MdDescription size={18} color="#151A40" /> Detailed Description
                </label>
                <textarea
                  value={desc}
                  onChange={e => setDesc(e.target.value)}
                  placeholder="Provide as much detail as possible to help our investigators..."
                  rows={4}
                  required
                  style={{
                    width: '100%', padding: '14px 16px', borderRadius: '12px',
                    border: '1.5px solid #E5E7EB', backgroundColor: '#F8F9FA',
                    fontSize: '14px', color: '#1a1a1a', outline: 'none',
                    resize: 'none', boxSizing: 'border-box', lineHeight: 1.6,
                  }}
                />
              </div>
            </div>

            {/* Upload + GPS + Location row */}
            <div className="submit-three-col">
              {/* Upload Proof */}
              <div style={{ position: 'relative' }}>
                {/* Hidden file input */}
                <input ref={fileInputRef} type="file" accept="image/*,application/pdf" multiple
                  style={{ display: 'none' }} onChange={handleFileChange} />

                {/* Main button */}
                <button type="button"
                  onClick={() => setShowUploadMenu(prev => !prev)}
                  style={{
                    width: '100%', padding: '28px 16px', borderRadius: '14px',
                    border: proofFiles.length ? '1.5px solid #151A40' : '1.5px dashed #E5E7EB',
                    backgroundColor: proofFiles.length ? '#eff9fd' : '#F8F9FA',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px',
                    cursor: 'pointer',
                  }}>
                  <MdUpload size={32} color="#151A40" />
                  <span style={{ fontSize: '12px', fontWeight: '700', color: '#555', letterSpacing: '0.5px' }}>
                    {proofFiles.length ? `${proofFiles.length} FILE${proofFiles.length > 1 ? 'S' : ''} SELECTED` : 'UPLOAD PROOF'}
                  </span>
                </button>

                {/* Popup menu — opens upward */}
                {showUploadMenu && (
                  <>
                    <div onClick={() => setShowUploadMenu(false)}
                      style={{ position: 'fixed', inset: 0, zIndex: 10 }} />
                    <div style={{
                      position: 'absolute', bottom: 'calc(100% + 8px)', left: 0, right: 0,
                      backgroundColor: '#fff', borderRadius: '12px',
                      border: '1px solid #e5e7eb', boxShadow: '0 -4px 24px rgba(0,0,0,0.12)',
                      zIndex: 20, overflow: 'hidden'
                    }}>
                      <button type="button"
                        onClick={() => { setShowUploadMenu(false); openCamera() }}
                        style={{
                          width: '100%', padding: '14px 16px', border: 'none', background: 'none',
                          display: 'flex', alignItems: 'center', gap: '12px',
                          cursor: 'pointer', fontSize: '14px', fontWeight: '600', color: '#1a1a1a',
                          borderBottom: '1px solid #f3f4f6', textAlign: 'left'
                        }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f9fafb'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        📷 Take Photo
                      </button>
                      <button type="button"
                        onClick={() => { setShowUploadMenu(false); fileInputRef.current.click() }}
                        style={{
                          width: '100%', padding: '14px 16px', border: 'none', background: 'none',
                          display: 'flex', alignItems: 'center', gap: '12px',
                          cursor: 'pointer', fontSize: '14px', fontWeight: '600', color: '#1a1a1a',
                          textAlign: 'left'
                        }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f9fafb'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        🖼️ Upload from Device
                      </button>
                    </div>
                  </>
                )}

                {/* File list */}
                {proofFiles.length > 0 && (
                  <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {proofFiles.map((f, i) => (
                      <div key={i} style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '6px 10px', borderRadius: '8px', backgroundColor: '#f3f4f6',
                        fontSize: '12px', color: '#374151'
                      }}>
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '140px' }}>{f.name}</span>
                        <button type="button" onClick={() => removeFile(i)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', fontWeight: '700', fontSize: '14px', padding: '0 4px' }}>
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button type="button"
                onClick={detectLocation}
                style={{
                  padding: '28px 16px', borderRadius: '14px',
                  border: location ? '1.5px solid #151A40' : '1.5px dashed #E5E7EB',
                  backgroundColor: location ? '#eff9fd' : '#F8F9FA',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px',
                  cursor: locationLoading ? 'wait' : 'pointer',
                  width: '100%'
                }}>
                {locationLoading
                  ? <div style={{ width: '32px', height: '32px', border: '3px solid #e5e7eb', borderTop: '3px solid #151A40', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                  : <MdLocationOn size={32} color={location ? '#151A40' : '#2563eb'} />
                }
                <span style={{ fontSize: '12px', fontWeight: '700', color: '#555', letterSpacing: '0.5px' }}>
                  {locationLoading ? 'DETECTING...' : location ? 'LOCATION SET' : 'GPS DETECT'}
                </span>
              </button>

              <div style={{
                display: 'flex', alignItems: 'center', gap: '14px',
                padding: '20px', borderRadius: '14px',
                backgroundColor: '#fff', border: `1px solid ${location ? '#151A40' : '#E5E7EB'}`,
              }}>
                <div style={{
                  width: '52px', height: '52px', borderRadius: '12px', flexShrink: 0,
                  background: location ? 'linear-gradient(135deg, #151A40, #1a7a9e)' : 'linear-gradient(135deg, #c8b89a 0%, #a89070 100%)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <MdLocationOn size={26} color="#fff" />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: '10px', fontWeight: '700', color: '#9e8e80', letterSpacing: '1px', margin: '0 0 4px' }}>CURRENT LOCATION</p>
                  {locationError ? (
                    <p style={{ fontSize: '12px', color: '#ef4444', margin: 0 }}>{locationError}</p>
                  ) : (
                    <p style={{ fontSize: '13px', fontWeight: '600', color: location ? '#1a1a1a' : '#9ca3af', margin: 0, wordBreak: 'break-word' }}>
                      {location
                        ? (location.includes(',') && location.split(',').length === 2 && !isNaN(location.split(',')[0])
                          ? 'Address unavailable — coordinates saved'
                          : location)
                        : 'Click GPS Detect to auto-fill'}
                    </p>
                  )}
                </div>
                {location && (
                  <button type="button" onClick={() => { setLocation(''); setLocationError(''); setLocationCoords(null) }}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', flexShrink: 0, color: '#9ca3af', fontSize: '18px', lineHeight: 1 }}>
                    ×
                  </button>
                )}
              </div>
            </div>

            {/* Submit */}
            <div className="submit-footer" style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
              {submitError && (
                <p style={{ width: '100%', margin: 0, fontSize: '13px', color: '#dc2626', backgroundColor: '#fef2f2', padding: '10px 14px', borderRadius: '8px' }}>
                  {submitError}
                </p>
              )}
              <button type="submit" disabled={submitting} style={{
                padding: '15px 40px', borderRadius: '14px',
                backgroundColor: submitting ? '#93c5fd' : '#151A40', color: '#fff', border: 'none',
                fontSize: '16px', fontWeight: '700', cursor: submitting ? 'wait' : 'pointer',
                display: 'flex', alignItems: 'center', gap: '8px',
                boxShadow: '0 4px 14px rgba(231,83,0,0.3)',
              }}>
                {submitting ? 'Submitting...' : 'Submit Grievance'} {!submitting && <MdArrowForward size={20} />}
              </button>
              <p style={{ fontSize: '13px', color: '#9e8e80', lineHeight: 1.6, margin: 0, flex: '1 1 200px' }}>
                By submitting, you agree to our Terms of Accountability and Truthful Reporting.
              </p>
            </div>

          </form>
        </div>
      </div>

      {/* Live Camera Modal */}
      {showCamera && (
        <div style={{
          position: 'fixed', inset: 0, backgroundColor: 'rgba(255,255,255,0.85)',
          backdropFilter: 'blur(8px)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          zIndex: 9999
        }}>
          {/* Top bar */}
          <div style={{ width: '100%', maxWidth: '640px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px' }}>
            <span style={{ color: '#1a1a1a', fontWeight: '700', fontSize: '16px' }}>Take Photo</span>
            <button onClick={closeCamera} style={{ background: 'rgba(0,0,0,0.08)', border: 'none', borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <MdClose size={20} color="#1a1a1a" />
            </button>
          </div>

          {/* Video */}
          <div style={{ position: 'relative', width: '100%', maxWidth: '640px', borderRadius: '16px', overflow: 'hidden', border: '1px solid #e5e7eb', boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}>
            {cameraError ? (
              <div style={{ padding: '60px 24px', textAlign: 'center', color: '#666', background: '#f9fafb' }}>
                <div style={{ fontSize: '40px', marginBottom: '12px' }}>📷</div>
                <p style={{ margin: 0, fontSize: '15px' }}>{cameraError}</p>
              </div>
            ) : (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                style={{ width: '100%', display: 'block', maxHeight: '60vh', objectFit: 'cover' }}
              />
            )}
          </div>

          {/* Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginTop: '24px' }}>
            <button onClick={flipCamera} style={{ background: 'rgba(0,0,0,0.08)', border: 'none', borderRadius: '50%', width: '48px', height: '48px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <MdFlipCameraAndroid size={24} color="#1a1a1a" />
            </button>

            <button onClick={capturePhoto} disabled={!!cameraError} style={{
              width: '72px', height: '72px', borderRadius: '50%',
              background: cameraError ? '#e5e7eb' : '#151A40',
              border: '4px solid rgba(37,150,190,0.25)',
              cursor: cameraError ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(37,150,190,0.35)'
            }}>
              <MdCamera size={32} color="#fff" />
            </button>

            <div style={{ width: '48px' }} />
          </div>
          <p style={{ color: '#9ca3af', fontSize: '12px', marginTop: '12px' }}>Tap the button to capture</p>
        </div>
      )}
    </UserLayout>
  )
}
