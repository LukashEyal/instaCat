import { Link } from 'react-router-dom'
import { ReactSVG } from 'react-svg'
import home from "../assets/svgs/home.svg"
import search from "../assets/svgs/search.svg"
import explore from "../assets/svgs/explore.svg"
import reels from "../assets/svgs/reels.svg"
import messages from "../assets/svgs/messages.svg"
import notifications from "../assets/svgs/notifications.svg"
import create from "../assets/svgs/create.svg"
// import profile from "../assets/svgs/profile.svg"
import threads from "../assets/svgs/threads.svg"
import more from "../assets/svgs/more.svg"

const sideBarItems = [
  {
    icon: "Home",
    path: home,
    linkTo: "/"
  },
  {
    icon: "Search",
    path: search,
    linkTo: "/search"
  },
  {
    icon: "Explore",
    path: explore,
    linkTo: "/explore"
  },
  {
    icon: "Reels",
    path: reels,
    linkTo: "/reels"
  },
  {
    icon: "Messages",
    path: messages,
    linkTo: "/messages"
  },
  {
    icon: "Notifications",
    path: notifications,
    linkTo: "/notifications"
  },
  {
    icon: "Create",
    path: create,
    linkTo: "/create"
  },
  {
    icon: "Profile",
    path: create,
    linkTo: "/profile"
  }
]

function SideBarItem({ icon, path, linkTo }) {
  return (
    <Link to={linkTo} className="sidebar-item">
      <ReactSVG src={path} />
      <div className='test'><span>{icon}</span></div>
    </Link>
  )
}


export function SideBar() {

  const sideBarElements = sideBarItems.map((sideBarItem, idx) => <SideBarItem key={idx} icon={sideBarItem.icon} path={sideBarItem.path} linkTo={sideBarItem.linkTo} />)

  return (

    <section className="side-bar">
      <div className="logo">
        <Link to="/" ><img src="/img/instagram-logo.png" alt="Instagram logo" /></Link>
      </div>
      <div className='sidebar-main-links'>
        {sideBarElements}
      </div>


      <SideBarItem icon="Threads" path={threads} linkTo="/threads" />
      <SideBarItem icon="More" path={more} linkTo="/more" />

    </section>
  )
}
