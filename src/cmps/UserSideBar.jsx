// UserSideBar.jsx
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import avatarPlaceHolder from '../assets/svgs/post-container/avatar-placeholder.svg'
import { SwitchUserModal } from './SwitchUserModal'

export function UserSideBar() {
  const user = useSelector(s => s.userModule.user)
  const users = useSelector(s => s.userModule.users) || []
  const [open, setOpen] = useState(false)
  const DEFAULT_AVATAR = avatarPlaceHolder

  if (!user) return null

  // pick 5 suggestions (exclude current user)
  const suggestions = users.filter(u => u?._id !== user?._id).slice(0, 5)

  return (
    <div className="user-sidebar">
      {/* Current user row */}
      <div className="user-info">
        <img src={user?.avatarUrl || DEFAULT_AVATAR} alt={user?.username || 'user'} />
        <div className="user-info__meta">
          <div className="username">{user?.username}</div>
          {user?.fullname ? <div className="fullname">{user.fullname}</div> : null}
        </div>

        <button className="switch-btn" type="button" onClick={() => setOpen(true)}>
          Switch
        </button>
      </div>

      {/* Suggestions header */}
      <div className="suggestions-header">
        <span className="title">Suggested for you</span>
      </div>

      {/* Suggestions list */}
      <ul className="suggestions-list">
        {suggestions.map(s => (
          <li key={s._id} className="suggestion-row">
            <img
              src={s?.avatarUrl || DEFAULT_AVATAR}
              alt={s?.username || 'user'}
              className="avatar"
            />
            <div className="meta">
              <div className="username">{s?.username}</div>
              <div className="sub">Suggested for you</div>
            </div>
            <button className="follow-btn" type="button">
              Follow
            </button>
          </li>
        ))}
      </ul>

      <div className="copyright">
        © 2025 <strong>INSTACAT</strong> FROM IDAN AND EYAL
      </div>

      {/* Modal */}
      {open && <SwitchUserModal onClose={() => setOpen(false)} />}
    </div>
  )
}
