import React from "react"
import { useSelector } from "react-redux"

export function UserSideBar() {
  const user = useSelector((storeState) => storeState.userModule.user)

  if (!user) return null

  return (
    <div className='user-sidebar'>
      <div className='user-info'>
        <img src={user.avatarUrl} alt={user.username} />
        <div>
          <div className='username'>{user.username}</div>
        </div>
      </div>
    </div>
  )
}
