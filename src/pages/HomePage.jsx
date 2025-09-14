import { Link } from "react-router-dom"

import { UserSideBar } from "../cmps/UserSideBar"

import { useSelector } from "react-redux"

import { useState, useEffect, useRef } from "react"

import { loadPosts } from "../store/posts.actions"

import { Post } from "../cmps/post/Post"
import { loadUser } from "../store/user.actions"

export function HomePage() {
  const loggedInUser = useSelector((storeState) => storeState.userModule.user)
  const posts = useSelector((store) => store.postsModule.posts)
  console.log("posts in homepage:", posts)

  useEffect(() => {
    if (posts && posts.length > 0) return
    loadPosts()
  }, [posts])

  if (!posts || posts.length === 0) return <div>Loading...</div>

  return (
    <div className='main-layout'>
      <div className='feed-container'>
        {posts.map((post) => (
          <Post key={post._id} post={post} user={loggedInUser} />
        ))}
      </div>
      <div className='sidebar-container'>
        <div className='user-sidebar'>
          <UserSideBar user={loggedInUser} />
        </div>
      </div>
    </div>
  )
}

// const [showModal, setShowModal] = useState(false)
// const [selectedComments, setSelectedComments] = useState([])
