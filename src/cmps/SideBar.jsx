import { Link } from 'react-router-dom'

export function SideBar() {
  return (
    <section className="side-bar">
      <div className="logo">
        <img src="../../public/img/instagram-logo.png" alt="instagram-logo" />
      </div>
      <nav>
      <Link to="/"><div className="sidebar-home">Home</div></Link>
      <Link to="/explore"><div className="sidebar-explore">Explore</div></Link>
      <Link to="/reels"><div className="sidebar-reels">Reels</div></Link>
      <Link to="/messages"><div className="sidebar-messages">Messages</div></Link>
      <Link to="/profile/123"><div className="sidebar-profile">Profile</div></Link>
      </nav>
    </section>
  )
}
