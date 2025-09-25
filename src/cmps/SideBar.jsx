import { Link, useLocation } from 'react-router-dom'
import { ReactSVG } from 'react-svg'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

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
// import moreActive from '../assets/svgs/more-active.svg' // not used

import { SearchDrawer } from './SearchDrawer.jsx'
import { CreateCmp } from './CreateCmp.jsx'
import { NotificationsDrawer } from './NotificationsDrawer.jsx'
import { SideBarItemMore } from './SideBarItemMore.jsx'
import { SideBarItem } from './SideBarItem.jsx'
import { ProfileSideBar } from './ProfileSideBar.jsx'

import { getActionSentMsg, incUnread, clearUnread } from '../store/msg.actions'
import { socketService, SOCKET_EVENT_ADD_MSG } from '../services/socket.service'
import { logout } from '../store/user.actions.js'

export function SideBar() {
  const dispatch = useDispatch()
  const location = useLocation()

  const [isSearchDrawerOpen, setIsSearchDrawerOpen] = useState(false)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [isMoreOpen, setIsMoreOpen] = useState(false)

  const unreadCount = useSelector(s => s.msgModule.unreadCount || 0)
  const loggedInUser = useSelector(s => s.userModule.user)

  const moreBtnRef = useRef(null)
  const dropdownRef = useRef(null)

  // Close "More" dropdown on outside click
  useEffect(() => {
    if (!isMoreOpen) return

    function handleClick(e) {
      const insideBtn = moreBtnRef.current?.contains(e.target)
      const insideDD = dropdownRef.current?.contains(e.target)
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

  // 🔔 Always-on socket listener: increments unread when NOT on /messages
  useEffect(() => {
    if (!loggedInUser?._id) return

    const onIncoming = msg => {
      const norm = {
        ...msg,
        from: msg.from ?? msg.byUserId ?? msg.senderId,
        to: msg.to ?? msg.toUserId ?? msg.recipientId,
      }

      // Ignore echoes of our own outgoing messages
      if (norm.from === loggedInUser._id) return

      // Keep previews fresh globally
      dispatch(getActionSentMsg(norm))

      // Only bump the badge when we're not on the messages page
      if (location.pathname !== '/messages') {
        incUnread()
      } else {
        // If we are on /messages, keep it cleared
        clearUnread()
      }
    }

    socketService.on(SOCKET_EVENT_ADD_MSG, onIncoming)
    return () => socketService.off(SOCKET_EVENT_ADD_MSG, onIncoming)
  }, [loggedInUser?._id, location.pathname, dispatch])

  // Ensure badge resets whenever we navigate to /messages
  useEffect(() => {
    if (location.pathname === '/messages') clearUnread()
  }, [location.pathname])

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
        isActive: isSearchDrawerOpen,
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
        badgeCount: unreadCount, // 🔴 badge
      },
      {
        icon: 'Create',
        path: create,
        isActive: isCreateOpen,
        onClick: () => onCreateClick(prev => !prev),
      },
    ],
    [isSearchDrawerOpen, isCreateOpen, unreadCount]
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
            <div ref={dropdownRef} className="sidebar-backdrop" onClick={e => e.stopPropagation()}>
              <div className="sidebar-more-dropdown-item" onClick={onLogout}>
                Log out
              </div>
            </div>
          )}
          <div ref={moreBtnRef}>
            <SideBarItemMore
              icon="More"
              path={more}
              isActive={isMoreOpen}
              onClick={() => setIsMoreOpen(prev => !prev)}
            />
          </div>
          <SideBarItem icon="Also from InstaCat" path={threads} />
        </div>
      </section>

      {isSearchDrawerOpen && <SearchDrawer onClose={() => changeSearchDrawer(false)} />}

      {isNotificationsOpen && <NotificationsDrawer onClose={() => setIsNotificationsOpen(false)} />}

      {isCreateOpen && <CreateCmp onClose={() => onCreateClick(false)} />}
    </>
  )
}
