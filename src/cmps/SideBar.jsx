import { Link, useLocation } from 'react-router-dom'
import { ReactSVG } from 'react-svg'
import { useMemo, useState } from 'react'

import home from '../assets/svgs/home.svg'
import search from '../assets/svgs/search.svg'
import explore from '../assets/svgs/explore.svg'
import reels from '../assets/svgs/reels.svg'
import messages from '../assets/svgs/messages.svg'
import notifications from '../assets/svgs/notifications.svg'
import create from '../assets/svgs/create.svg'
import threads from '../assets/svgs/threads.svg'
import more from '../assets/svgs/more.svg'
import logoFull from '../assets/svgs/instacat-logo.svg'
import logoIcon from '../assets/svgs/instacat-logo-icon.svg'

import homeActive from '../assets/svgs/home-active.svg'
import searchActive from '../assets/svgs/search-active.svg'
import exploreActive from '../assets/svgs/explore-active.svg'
import reelsActive from '../assets/svgs/reels-active.svg'
import messagesActive from '../assets/svgs/messages-active.svg'
import notificationsActive from '../assets/svgs/notifications-active.svg'
import moreActive from '../assets/svgs/more-active.svg'

import { SearchDrawer } from './SearchDrawer.jsx'
import { CreateCmp } from './CreateCmp.jsx'
import { NotificationsDrawer } from './NotificationsDrawer.jsx'

import { useSelector } from 'react-redux'
// import { loadUser } from "../store/user.actions.js"

import avatarPlaceHolder from '../assets/svgs/post-container/avatar-placeholder.svg'

export function SideBar() {
	const user = useSelector(storeState => storeState.userModule.user)

	const [isSearchDrawerOpen, setIsSearchDrawerOpen] = useState(false)
	const [isCreateOpen, setIsCreateOpen] = useState(false)
	const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)

	function changeSearchDrawer(stateOrUpdater) {
		// close others if you like single-open behavior
		setIsNotificationsOpen(false)
		setIsSearchDrawerOpen(stateOrUpdater)
	}

	function onCreateClick(stateOrUpdater) {
		setIsNotificationsOpen(false)
		setIsSearchDrawerOpen(false)
		setIsCreateOpen(stateOrUpdater)
	}

	function onNotificationsClick(stateOrUpdater) {
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
				linkTo: '/homepage',
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
			// {
			// 	icon: 'Reels',
			// 	path: reels,
			// 	activePath: reelsActive,
			// 	linkTo: '/reels',
			// },
			{
				icon: 'Messages',
				path: messages,
				activePath: messagesActive,
				linkTo: '/messages',
			},
			// {
			// 	icon: 'Notifications',
			// 	path: notifications,
			// 	activePath: notificationsActive,
			// 	isActive: isNotificationsOpen,
			// 	onClick: () => onNotificationsClick(prev => !prev), // drawer toggle
			// 	// no linkTo -> prevents navigation; click opens drawer
			// },
			{
				icon: 'Create',
				path: create,
				// activePath: createActive, // if you add one later
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
					<SideBarItem
						icon="More"
						path={more}
						activePath={moreActive}
						linkTo="/more"
					/>
					<SideBarItem
						icon="Also from InstaCat"
						path={threads}
						linkTo="/threads"
					/>
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
