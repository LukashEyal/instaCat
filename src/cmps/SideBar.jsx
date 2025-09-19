import { Link, useLocation } from 'react-router-dom'
import { ReactSVG } from 'react-svg'
import { useMemo, useState } from 'react'

import home from '../assets/svgs/home.svg'
import search from '../assets/svgs/search.svg'
import explore from '../assets/svgs/explore.svg'
// import reels from '../assets/svgs/reels.svg'
import messages from '../assets/svgs/messages.svg'
// import notifications from '../assets/svgs/notifications.svg'
import create from '../assets/svgs/create.svg'
import threads from '../assets/svgs/threads.svg'
import more from '../assets/svgs/more.svg'
import logoFull from '../assets/svgs/instacat-logo.svg'
import logoIcon from '../assets/svgs/instacat-logo-icon.svg'

import homeActive from '../assets/svgs/home-active.svg'
import searchActive from '../assets/svgs/search-active.svg'
import exploreActive from '../assets/svgs/explore-active.svg'
// import reelsActive from '../assets/svgs/reels-active.svg'
import messagesActive from '../assets/svgs/messages-active.svg'
// import notificationsActive from '../assets/svgs/notifications-active.svg'
import moreActive from '../assets/svgs/more-active.svg'

import { SearchDrawer } from './SearchDrawer.jsx'
import { CreateCmp } from './CreateCmp.jsx'
import { NotificationsDrawer } from './NotificationsDrawer.jsx'

import { useSelector } from 'react-redux'

import avatarPlaceHolder from '../assets/svgs/post-container/avatar-placeholder.svg'

import { logout } from '../store/user.actions.js'

function onLogout() {
	logout()
}

export function SideBar() {
	const user = useSelector(storeState => storeState.userModule.user)

	const [isSearchDrawerOpen, setIsSearchDrawerOpen] = useState(false)
	const [isCreateOpen, setIsCreateOpen] = useState(false)
	const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
	const [isMoreOpen, setIsMoreOpen] = useState(false)

	function changeSearchDrawer(stateOrUpdater) {
		// close others if you like single-open behavior
		setIsNotificationsOpen(false)
		setIsMoreOpen(false)
		setIsSearchDrawerOpen(stateOrUpdater)
	}

	function onCreateClick(stateOrUpdater) {
		setIsNotificationsOpen(false)
		setIsSearchDrawerOpen(false)
		setIsMoreOpen(false)
		setIsCreateOpen(stateOrUpdater)
	}

	function onNotificationsClick(stateOrUpdater) {
		setIsMoreOpen(false)
		setIsSearchDrawerOpen(false)
		setIsNotificationsOpen(stateOrUpdater)
	}

	// Build the items with activePath + optional manual isActive
	const sideBarItems = useMemo(
		() => [
			{
				icon: 'Home',
				path: home,
				activePath: homeActive,
				linkTo: '/',
			},
			{
				icon: 'Search',
				path: search,
				activePath: searchActive,
				isActive: isSearchDrawerOpen, // manual active when drawer open
				onClick: () => changeSearchDrawer(prev => !prev),
			},
			{
				icon: 'Explore',
				path: explore,
				activePath: exploreActive,
				linkTo: '/explore',
			},
			{
				icon: 'Messages',
				path: messages,
				activePath: messagesActive,
				linkTo: '/messages',
			},
			{
				icon: 'Create',
				path: create,
				isActive: isCreateOpen,
				onClick: () => onCreateClick(prev => !prev),
			},
		],
		[isSearchDrawerOpen, isCreateOpen, isNotificationsOpen]
	)

	return (
		<>
			<section className="side-bar">
				<div className="logo">
					{/* keep the link only if you actually want it clickable */}
					<Link to="/" className="logo-link">
						<ReactSVG src={logoFull} className="logo-full" />
						<ReactSVG src={logoIcon} className="logo-icon" />
					</Link>
				</div>

				<div className="sidebar-main-links">
					{sideBarItems.map((item, index) => (
						<SideBarItem key={index} {...item} />
					))}
					<ProfileSideBar />
				</div>

				<div className="sidebar-side-items">
					{isMoreOpen && (
						<div
							className="sidebar-backdrop"
							onClick={() => setIsMoreOpen(false)}
						>
							<div
								className="sidebar-more-dropdown-item"
								onClick={onLogout}
							>
								Log out
							</div>
						</div>
					)}
					<SideBarItemMore
						icon="More"
						path={more}
						// activePath={moreActive}
						isActive={isMoreOpen}
						onClick={() => setIsMoreOpen(prev => !prev)}
					/>
					<SideBarItem icon="Also from InstaCat" path={threads} />
				</div>
			</section>

			{isSearchDrawerOpen && (
				<SearchDrawer onClose={() => changeSearchDrawer(false)} />
			)}

			{isNotificationsOpen && (
				<NotificationsDrawer
					onClose={() => setIsNotificationsOpen(false)}
				/>
			)}

			{isCreateOpen && (
				<CreateCmp
					loggedInUser={user}
					onClose={() => onCreateClick(false)}
				/>
			)}
		</>
	)
}

function ProfileSideBar() {
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

function SideBarItem({
	icon,
	path,
	activePath,
	linkTo,
	onClick,
	isActive: isActiveProp,
}) {
	const location = useLocation()
	const routeActive = linkTo ? location.pathname === linkTo : false
	const isActive =
		typeof isActiveProp === 'boolean' ? isActiveProp : routeActive

	const svgSrc = isActive && activePath ? activePath : path

	const content = (
		<>
			<ReactSVG src={svgSrc} />
			<div className="sidebar-item-name">
				<span>{icon}</span>
			</div>
		</>
	)

	if (onClick) {
		return (
			<div
				className={`sidebar-item ${isActive ? 'active' : ''}`}
				onClick={onClick}
				role="button"
				tabIndex={0}
				onKeyDown={e =>
					(e.key === 'Enter' || e.key === ' ') && onClick(e)
				}
			>
				{content}
			</div>
		)
	}
	if (!linkTo) {
		return (
			<div className={`sidebar-item ${isActive ? 'active' : ''}`}>
				{content}
			</div>
		)
	}

	return (
		<Link
			to={linkTo}
			className={`sidebar-item ${isActive ? 'active' : ''}`}
			aria-current={isActive ? 'page' : undefined}
		>
			{content}
		</Link>
	)
}

function SideBarItemMore({ icon, path, onClick, isActive }) {
	const svgSrc = path

	const content = (
		<>
			<ReactSVG src={svgSrc} />
			<div className="sidebar-item-name">
				<span>{icon}</span>
			</div>
		</>
	)

	return (
		<div
			className={`sidebar-item ${isActive ? 'active' : ''}`}
			onClick={onClick}
			role="button"
			tabIndex={0}
			onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && onClick(e)}
		>
			{content}
		</div>
	)
}
