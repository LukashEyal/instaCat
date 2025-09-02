import React from "react"



import { Routes, Route, Navigate } from "react-router"
import { userService } from "./services/user"
import { HomePage } from "./pages/HomePage"
import { SideBar } from "./cmps/SideBar.jsx"

import { Explore } from "./pages/Explore.jsx"
import { Reels } from "./pages/Reels.jsx"
import { Messages } from "./pages/Messages.jsx"
import { Profile } from "./pages/Profile.jsx"


export function RootCmp() {
	return (
		<div className="main-container">
			<SideBar />
		

			<main>
				<Routes>
					<Route path="/" element={<HomePage />} />
					<Route path="/explore" element={<Explore />} />
					<Route path="/reels" element={<Reels />} />
					<Route path="/messages" element={<Messages />} />
					<Route path="/profile/:userId" element={<Profile />} />

					{/* <Route path="" element={<HomePage />} />
                    <Route path="about" element={<AboutUs />}>
                        <Route path="team" element={<AboutTeam />} />
                        <Route path="vision" element={<AboutVision />} />
                    </Route>
                    <Route path="car" element={<CarIndex />} />
                    <Route path="car/:carId" element={<CarDetails />} />
                    <Route path="user/:id" element={<UserDetails />} />
                    <Route path="review" element={<ReviewIndex />} />
                    <Route path="chat" element={<ChatApp />} />
                    <Route path="admin" element={
                        <AuthGuard checkAdmin={true}>
                            <AdminIndex />
                        </AuthGuard>
                    } />
                    <Route path="login" element={<LoginSignup />}>
                        <Route index element={<Login />} />
                        <Route path="signup" element={<Signup />} />
                    </Route> */}
				</Routes>
			</main>
		</div>
	)
}

function AuthGuard({ children, checkAdmin = false }) {
	const user = userService.getLoggedinUser()
	const isNotAllowed = !user || (checkAdmin && !user.isAdmin)
	if (isNotAllowed) {
		console.log("Not Authenticated!")
		return <Navigate to="/" />
	}
	return children
}
