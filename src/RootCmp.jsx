import React from "react";
import { useSelector } from "react-redux";
import { Routes, Route, Navigate, Outlet, useLocation } from "react-router-dom";
import { SideBar } from "./cmps/SideBar.jsx";
import { HomePage } from "./pages/HomePage";
import { Explore } from "./pages/Explore.jsx";
import { Reels } from "./pages/Reels.jsx";
import { Messages } from "./pages/Messages.jsx";
import { Profile } from "./pages/Profile.jsx";
import { LoginSignup } from "./pages/LoginSignUp.jsx";

// ✅ Read the *actual* user from Redux
const useUser = () => useSelector(s => s.userModule.user); // NOT userService

function RedirectIfAuthed() {
  const user = useUser();
  return user ? <Navigate to="/homepage" replace /> : <Outlet />;
}

function RequireAuth() {
  const user = useUser();
  const location = useLocation();
  return user ? <Outlet /> : <Navigate to="/" replace state={{ from: location }} />;
}

function AppLayout() {
  return (
    <div className="main-container">
      <SideBar />
      <main>
      <Outlet />
      </main>
    </div>
  );
}

export function RootCmp() {
  return (
    <Routes>
      {/* Public/auth route(s) */}
      <Route element={<RedirectIfAuthed />}>
        <Route path="/" element={<LoginSignup />} />
      </Route>

      {/* Private app route(s) */}
      <Route element={<RequireAuth />}>
        <Route element={<AppLayout />}>
          <Route path="/homepage" element={<HomePage />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/reels" element={<Reels />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/profile/:userId" element={<Profile />} />
        </Route>
      </Route>

      {/* Fallbacks */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}