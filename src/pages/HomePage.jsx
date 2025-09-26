import { UserSideBar } from '../cmps/UserSideBar'
import { useSelector } from 'react-redux'
import { useEffect } from 'react'
import { loadPosts } from '../store/posts.actions'
import { Post } from '../cmps/post/Post'
import { loadUsers } from '../store/user.actions'
import {
  socketService,
  SOCKET_EVENT_POST_ADDED,
  SOCKET_EVENT_POST_UPDATED,
} from '../services/socket.service'

export function HomePage() {
  const loggedInUser = useSelector(s => s.userModule.user)
  const posts = useSelector(s => s.postsModule.posts) || []
  const users = useSelector(s => s.userModule.users) || []

  useEffect(() => {
    loadPosts()
    loadUsers()

    const onAdded = post => {
      loadPosts()
      return post
    }
    const onUpdated = post => {
      loadPosts()
      return post
    }

    socketService.on(SOCKET_EVENT_POST_ADDED, onAdded)
    socketService.on(SOCKET_EVENT_POST_UPDATED, onUpdated)

    return () => {
      socketService.off(SOCKET_EVENT_POST_ADDED, onAdded)
      socketService.off(SOCKET_EVENT_POST_UPDATED, onUpdated)
    }
  }, [])

  return (
    <div className="main-layout">
      <div className="feed-container">
        {posts.map(post => {
          const postUser = users.find(user => user._id === post.userId)
          return <Post key={post._id} post={post} user={loggedInUser} postUser={postUser} />
        })}
      </div>
      <UserSideBar />
    </div>
  )
}
