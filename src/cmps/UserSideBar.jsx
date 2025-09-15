import React from "react"
import { useSelector } from "react-redux"

import avatarPlaceHolder from "../assets/svgs/post-container/avatar-placeholder.svg"

export function UserSideBar() {
	const user = useSelector(storeState => storeState.userModule.user)
	const DEFAULT_AVATAR = avatarPlaceHolder;

	if (!user) return null

	return (
		<div className="user-sidebar">
			<div className="user-info">
				<img src={user?.avatarUrl || DEFAULT_AVATAR} alt={user.username} />
				<div>
					<div className="username">{user.username}</div>
				</div>
			</div>
		</div>
	)
}
