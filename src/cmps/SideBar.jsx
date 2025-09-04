import { Link, useLocation } from "react-router-dom"
import { ReactSVG } from "react-svg"
import { useEffect, useState } from "react"

import home from "../assets/svgs/home.svg"
import search from "../assets/svgs/search.svg"
import explore from "../assets/svgs/explore.svg"
import reels from "../assets/svgs/reels.svg"
import messages from "../assets/svgs/messages.svg"
import notifications from "../assets/svgs/notifications.svg"
import create from "../assets/svgs/create.svg"
import threads from "../assets/svgs/threads.svg"
import more from "../assets/svgs/more.svg"
import logo from "../assets/svgs/instacat-logo.svg"

import { SearchDrawer } from "./SearchDrawer.jsx"
import { CreateCmp } from "./CreateCmp.jsx"

import { useSelector } from "react-redux"
import { loadUser } from "../store/user.actions.js"

export function SideBar() {
	useEffect(() => {
		loadUser()
	}, [])

	const user = useSelector(storeState => storeState.userModule.user)

	const [isSearchDrawerOpen, setIsSearchDrawerOpen] = useState(false)
	const [isCreateOpen, setIsCreateOpen] = useState(false)

	function changeSearchDrawer(state) {
		setIsSearchDrawerOpen(state)
	}

	function onCreateClick(state) {
		setIsCreateOpen(state)
	}

	const sideBarItems = [
		{
			icon: "Home",
			path: home,
			linkTo: "/",
		},
		{
			icon: "Search",
			path: search,
			onClick: () => changeSearchDrawer(prev => !prev),
		},
		{
			icon: "Explore",
			path: explore,
			linkTo: "/explore",
		},
		{
			icon: "Reels",
			path: reels,
			linkTo: "/reels",
		},
		{
			icon: "Messages",
			path: messages,
			linkTo: "/messages",
		},
		{
			icon: "Notifications",
			path: notifications,
			linkTo: "/notifications",
		},
		{
			icon: "Create",
			path: create,
			onClick: () => onCreateClick(prev => !prev),
		},
	]

	if (user.length === 0) {
		return <div className="loader">Loading...</div>
	}

	return (
		<>
			<section className="side-bar">
				<div className="logo">
					<Link to="/">
						<ReactSVG
							src={logo}
							style={{
								margin: "0px 0px 19px",
								padding: "25px 12px 16px",
							}}
						/>
						{/* <img src={logo} alt="InstaCat logo" /> */}
					</Link>
				</div>
				<div className="sidebar-main-links">
					{sideBarItems.map((item, index) => (
						<SideBarItem key={index} {...item} />
					))}

					<ProfileSideBar />
				</div>
				<div className="sidebar-side-items">
					<SideBarItem icon="More" path={more} linkTo="/more" />
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
			{isCreateOpen && <CreateCmp onClose={() => onCreateClick(false)} />}
		</>
	)
}

function ProfileSideBar() {
	const user = useSelector(storeState => storeState.userModule.user)
	
	if (!user) return null

	const { avatarUrl, _id: userId } = user
	const icon = "Profile"
	const linkTo = `/profile/${userId}`
	const location = useLocation()
	const isActive = location.pathname === linkTo

	return (
		<Link
			to={linkTo}
			className={`sidebar-item ${isActive ? "active" : ""}`}
		>
			<div className="sidebar-profile-avatar">
				<img src={avatarUrl} alt="User Profile" />
			</div>
			<div className="sidebar-item-name">
				<span>{icon}</span>
			</div>
		</Link>
	)
}

function SideBarItem({ icon, path, linkTo, onClick }) {
	const location = useLocation()
	const isActive = location.pathname === linkTo

	const content = (
		<>
			<ReactSVG src={path} />
			<div className="sidebar-item-name">
				<span>{icon}</span>
			</div>
		</>
	)

	if (onClick) {
		return (
			<div
				className={`sidebar-item ${isActive ? "active" : ""}`}
				onClick={onClick}
			>
				{content}
			</div>
		)
	}

	return (
		<Link
			to={linkTo}
			className={`sidebar-item ${isActive ? "active" : ""}`}
		>
			{content}
		</Link>
	)
}
