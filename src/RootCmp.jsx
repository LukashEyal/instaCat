// RootCmp.jsx
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Routes, Route, Navigate, Outlet } from 'react-router-dom'

import { SideBar } from './cmps/SideBar.jsx'
import { HomePage } from './pages/HomePage'
import { Explore } from './pages/Explore.jsx'
import { Reels } from './pages/Reels.jsx'
import { Messages } from './pages/Messages.jsx'
import { Profile } from './pages/Profile.jsx'
import { LoginSignup } from './pages/LoginSignup.jsx'
import { SET_USER } from './store/user.reducer.js'
import { ExplorePost } from './pages/ExplorePost.jsx'

const STORAGE_KEY = 'loggedinUser' // your sessionStorage key

function AppLayout() {
	return (
		<div className="main-container">
			<SideBar />
			<main>
				<Outlet />
			</main>
		</div>
	)
}

export function RootCmp() {
	const dispatch = useDispatch()
	const [ready, setReady] = useState(false)

	useEffect(() => {
		try {
			const saved = sessionStorage.getItem(STORAGE_KEY)
			if (saved) {
				const user = JSON.parse(saved)
				if (user) dispatch({ type: SET_USER, user: user })
			}
		} catch (_) {}
		setReady(true)
	}, [dispatch])

	const loggedinUser = useSelector(s => s.userModule.user)

	if (!ready) return null

	return (
		<Routes>
			{!loggedinUser ? (
				// Public routes
				<>
					<Route path="/" element={<LoginSignup />} />
					<Route path="*" element={<Navigate to="/" replace />} />
				</>
			) : (
				// Private routes
				<>
					<Route element={<AppLayout />}>
						<Route path="/" element={<HomePage />} />
						<Route path="/explore" element={<Explore />} />
						<Route path="/reels" element={<Reels />} />
						<Route path="/messages" element={<Messages />} />
						<Route path="/profile/:userId" element={<Profile />} />
						<Route
							path="/p/:explorePostId"
							element={<ExplorePost />}
						/>
					</Route>
					<Route path="*" element={<Navigate to="/" replace />} />
				</>
			)}
		</Routes>
	)
}
