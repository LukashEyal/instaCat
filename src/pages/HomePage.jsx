import { UserSideBar } from '../cmps/UserSideBar'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { loadPosts, getAddedPostAction } from '../store/posts.actions'
import { Post } from '../cmps/post/Post'
import { loadUsers } from '../store/user.actions'
import {
  socketService,
  SOCKET_EVENT_POST_ADDED,
  SOCKET_EVENT_POST_UPDATED,
} from '../services/socket.service'

export function HomePage() {
  const loggedInUser = useSelector(storeState => storeState.userModule.user)
  const posts = useSelector(store => store.postsModule.posts)
  const users = useSelector(store => store.userModule.users)

  useEffect(() => {
    loadPosts()
    loadUsers()

    socketService.on(SOCKET_EVENT_POST_ADDED, post => {
      console.log(`GOT FROM SOCKET`, post)
      loadPosts()
    })

    socketService.on(SOCKET_EVENT_POST_UPDATED, post => {
      console.log(`GOT FROM SOCKET`, post)
      loadPosts()
    })

    return () => {
      socketService.off(SOCKET_EVENT_POST_ADDED)
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
