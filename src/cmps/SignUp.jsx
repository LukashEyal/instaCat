// Signup.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router'
import { signup } from '../store/user.actions'
import { userService } from '../services/user'
import { AvatarUploader } from './AvatarUploader.jsx'

const PLACEHOLDER_AVATAR =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120">
      <defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
        <stop stop-color="#e5e7eb"/><stop offset="1" stop-color="#d1d5db"/></linearGradient>
      </defs>
      <circle cx="60" cy="60" r="60" fill="url(#g)"/>
      <circle cx="60" cy="45" r="22" fill="#bdbdbd"/>
      <path d="M22 104c7-18 28-26 38-26s31 8 38 26" fill="#bdbdbd"/>
    </svg>
  `);

export function Signup({ onDone }) {
  const [credentials, setCredentials] = useState(userService.getEmptyUser())
  const [avatarUrl, setAvatarUrl] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()

  function clearState() {
    setCredentials({ username: '', password: '', avatarUrl: ''})
    setAvatarUrl('')
  }

  function handleChange(ev) {
    const { name, value } = ev.target
    setCredentials(prev => ({ ...prev, [name]: value }))
  }

  const isValid = credentials.username.trim() !== '' && credentials.password.trim() !== ''

  async function onSignup(ev) {
    if (ev) ev.preventDefault()
    if (!isValid || isSubmitting) return
    setIsSubmitting(true)
    try {
      // trim fields before sending
      const payload = {
        ...credentials,
        username: credentials.username.trim(),
        password: credentials.password.trim(),
        avatarUrl: avatarUrl
      }

      console.log(payload)
      await signup(payload)
      clearState()
      onDone?.()
      navigate('/homepage')
    } catch (err) {
      console.error('Signup failed:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  function onUploaded(imgUrl) {
    
    setAvatarUrl(imgUrl)
  }

  return (
    <form className="signup-form" onSubmit={onSignup} noValidate>
      {/* Avatar uploader + preview (avatar is the trigger) */}
      <AvatarUploader onUploaded={onUploaded}>
        {({ openPicker, isUploading }) => (
          <button
            type="button"
            className="signup-avatar"
            onClick={openPicker}
            aria-label="Upload profile image"
            aria-busy={isUploading || undefined}
          >
            <img
              className="signup-avatar__img"
              src={avatarUrl || PLACEHOLDER_AVATAR}
              alt="Profile avatar preview"
            />
            <span className="signup-avatar__badge">
              {isUploading ? 'Uploading…' : 'Change'}
            </span>
          </button>
        )}
      </AvatarUploader>

      <input
        type="text"
        name="username"
        value={credentials.username}
        placeholder="Username"
        onChange={handleChange}
        required
      />
      <input
        type="password"
        name="password"
        value={credentials.password}
        placeholder="Password"
        onChange={handleChange}
        required
      />

      <button type="submit" disabled={!isValid || isSubmitting}>
        {isSubmitting ? 'Signing up…' : 'Signup'}
      </button>
    </form>
  )
}
