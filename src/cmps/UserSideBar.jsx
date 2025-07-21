import React from 'react'

export function UserSideBar({ user }) {
  if (!user) return null

  return (
    <div className="user-sidebar">
      <img src={user.avatarUrl} alt={user.username} />
      <div>
        <div className="username">{user.username}</div>
        <div className="fullname">{user.userFullname}</div>
      </div>
    </div>
  )
}
