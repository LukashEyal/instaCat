import { Link } from 'react-router-dom'

import { UserSideBar } from '../cmps/UserSideBar'

import { useSelector } from 'react-redux'

import { useState, useEffect } from 'react'

import { loadPosts } from '../store/posts.actions'

import { Post } from '../cmps/Post'
import { loadUser } from '../store/user.actions'

export function HomePage() {
  const loggedInUser = useSelector((storeState) => storeState.userModule.user)

  useEffect(() => {
    loadUser()

    loadPosts()
  }, [])

  return (
    <div className="main-layout">
      <div className="feed-container">
        <Post user={loggedInUser} />
      </div>
      <div className="sidebar-container">
        <div className="user-sidebar">
          <UserSideBar user={loggedInUser} />
        </div>
      </div>
    </div>
  )
}
