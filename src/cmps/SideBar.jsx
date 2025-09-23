import { Link } from 'react-router-dom'
import { ReactSVG } from 'react-svg'
import { useEffect, useMemo, useRef, useState } from 'react'

import home from '../assets/svgs/home.svg'
import search from '../assets/svgs/search.svg'
import explore from '../assets/svgs/explore.svg'
import messages from '../assets/svgs/messages.svg'
import create from '../assets/svgs/create.svg'
import threads from '../assets/svgs/threads.svg'
import more from '../assets/svgs/more.svg'
import logoFull from '../assets/svgs/instacat-logo.svg'
import logoIcon from '../assets/svgs/instacat-logo-icon.svg'
import homeActive from '../assets/svgs/home-active.svg'
import searchActive from '../assets/svgs/search-active.svg'
import exploreActive from '../assets/svgs/explore-active.svg'
import messagesActive from '../assets/svgs/messages-active.svg'
import moreActive from '../assets/svgs/more-active.svg'

import { SearchDrawer } from './SearchDrawer.jsx'
import { CreateCmp } from './CreateCmp.jsx'
import { NotificationsDrawer } from './NotificationsDrawer.jsx'
import { SideBarItemMore } from './SideBarItemMore.jsx'
import { SideBarItem } from './SideBarItem.jsx'
import { ProfileSideBar } from './ProfileSideBar.jsx'

import { logout } from '../store/user.actions.js'

export function SideBar() {
	const [isSearchDrawerOpen, setIsSearchDrawerOpen] = useState(false)
	const [isCreateOpen, setIsCreateOpen] = useState(false)
	const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
	const [isMoreOpen, setIsMoreOpen] = useState(false)

	const moreBtnRef = useRef(null) // the "More" button
	const dropdownRef = useRef(null) // the dropdown itself

	useEffect(() => {
		if (!isMoreOpen) return

		function handleClick(e) {
			const insideBtn = moreBtnRef.current?.contains(e.target)
			const insideDD = dropdownRef.current?.contains(e.target)
			console.log('e.target', e.target)
			console.log('moreBtnRef.current', moreBtnRef.current)
			if (!insideBtn && !insideDD) {
				setIsMoreOpen(false)
			}
		}

		document.addEventListener('click', handleClick)
		return () => document.removeEventListener('click', handleClick)
	}, [isMoreOpen])

	function onLogout() {
		logout()
	}

	function changeSearchDrawer(stateOrUpdater) {
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
							ref={dropdownRef}
							className="sidebar-backdrop"
							onClick={e => e.stopPropagation()}
						>
							<div
								className="sidebar-more-dropdown-item"
								onClick={onLogout}
							>
								Log out
							</div>
						</div>
					)}
					<div ref={moreBtnRef}>
						<SideBarItemMore
							icon="More"
							path={more}
							// activePath={moreActive}
							isActive={isMoreOpen}
							onClick={() => setIsMoreOpen(prev => !prev)}
						/>
					</div>
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

			{isCreateOpen && <CreateCmp onClose={() => onCreateClick(false)} />}
		</>
	)
}
