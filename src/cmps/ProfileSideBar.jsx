import avatarPlaceHolder from '../assets/svgs/post-container/avatar-placeholder.svg'
import { useSelector } from 'react-redux'
import { Link, useLocation } from 'react-router-dom'

export function ProfileSideBar() {
	const user = useSelector(storeState => storeState.userModule.user)
	const DEFAULT_AVATAR = avatarPlaceHolder
	if (!user) return null

	const { avatarUrl, _id: userId } = user
	const icon = 'Profile'
	const linkTo = `/profile/${userId}`
	const location = useLocation()
	const isActive = location.pathname === linkTo

	return (
		<Link
			to={linkTo}
			className={`sidebar-item ${isActive ? 'active' : ''}`}
			aria-current={isActive ? 'page' : undefined}
		>
			<div className="sidebar-profile-avatar">
				<img src={avatarUrl || DEFAULT_AVATAR} alt="User Profile" />
			</div>
			<div className="sidebar-item-name">
				<span>{icon}</span>
			</div>
		</Link>
	)
}
