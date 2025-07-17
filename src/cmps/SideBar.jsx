import { Link } from 'react-router-dom'

export function SideBar() {
  return (
    <section className="side-bar">
      <div className="logo">
        <img src="../../public/img/instagram-logo.png" alt="instagram-logo" />
      </div>
      <div className="sidebar-home"><Link to="/">Home</Link></div>
      <div className="sidebar-explore"><Link to="/explore">Explore</Link></div>
      <div className="sidebar-reels"><Link to="/reels">Reels</Link></div>
      <div className="sidebar-messages"><Link to="/messages">Messages</Link></div>
      <div className="sidebar-profile"><Link to="/profile/123">Profile</Link></div>
    </section>
  )
}
