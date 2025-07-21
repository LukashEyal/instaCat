import { Link } from 'react-router-dom'
import { ReactSVG } from 'react-svg'
import { useState } from 'react'

import home from '../assets/svgs/home.svg'
import search from '../assets/svgs/search.svg'
import explore from '../assets/svgs/explore.svg'
import reels from '../assets/svgs/reels.svg'
import messages from '../assets/svgs/messages.svg'
import notifications from '../assets/svgs/notifications.svg'
import create from '../assets/svgs/create.svg'
import threads from '../assets/svgs/threads.svg'
import more from '../assets/svgs/more.svg'

import { SearchDrawer } from './SearchDrawer.jsx'
import { CreateCmp } from './CreateCmp.jsx'

const userId = 123

function SideBarItem({ icon, path, linkTo, onClick }) {
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
      <div className="sidebar-item" onClick={onClick}>
        {content}
      </div>
    )
  }

  return (
    <Link to={linkTo} className="sidebar-item">
      {content}
    </Link>
  )
}

export function SideBar() {
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
      icon: 'Home',
      path: home,
      linkTo: '/',
    },
    {
      icon: 'Search',
      path: search,
      onClick: () => changeSearchDrawer((prev) => !prev),
    },
    {
      icon: 'Explore',
      path: explore,
      linkTo: '/explore',
    },
    {
      icon: 'Reels',
      path: reels,
      linkTo: '/reels',
    },
    {
      icon: 'Messages',
      path: messages,
      linkTo: '/messages',
    },
    {
      icon: 'Notifications',
      path: notifications,
      linkTo: '/notifications',
    },
    {
      icon: 'Create',
      path: create,
      onClick: () => onCreateClick((prev) => !prev),
    },
    {
      icon: 'Profile',
      path: create,
      linkTo: `/profile/${userId}`,
    },
  ]

  return (
    <>
      <section className="side-bar">
        <div className="logo">
          <Link to="/">
            <img
              src="/img/instacat-logo.svg"
              alt="Instagram logo"
              width="100%"
              height="100%"
            />
          </Link>
        </div>
        <div className="sidebar-main-links">
          {sideBarItems.map((item, index) => (
            <SideBarItem key={index} {...item} />
          ))}
        </div>
        <SideBarItem icon="Threads" path={threads} linkTo="/threads" />
        <SideBarItem icon="More" path={more} linkTo="/more" />
      </section>

      {isSearchDrawerOpen && (
        <SearchDrawer onClose={() => changeSearchDrawer(false)} />
      )}
      {isCreateOpen && <CreateCmp onClose={() => onCreateClick(false)} />}
    </>
  )
}
