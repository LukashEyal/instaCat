import { Link } from 'react-router-dom'

import { postService } from '../services/posts/post.service'

import { userService } from '../services/user'

import { UserSideBar } from '../cmps/UserSideBar'

import { useSelector } from 'react-redux'

import { useState, useEffect } from 'react'

import { loadPosts } from '../store/posts.actions'

import { PostsIndex } from '../cmps/PostsIndex'
import { loadUser, loadUsers } from '../store/user.actions'

export function HomePage() {
  const loggedInUser = useSelector((storeState) => storeState.userModule.user)
  const posts = useSelector((storeState) => storeState.postsModule.posts)
  const users = useSelector((storeState) => storeState.userModule.users)

  useEffect(() => {
    loadUser()
    loadUsers()
    loadPosts()
  }, [])

  return (
    <div className="main-layout">
      <div className="feed-container">
        <PostsIndex posts={posts} users={users} />
      </div>
      <div className="sidebar-container">
        <UserSideBar user={loggedInUser} />
      </div>
    </div>
  )
}
