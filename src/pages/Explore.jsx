// Explore.jsx
import { useEffect, useMemo, useState } from 'react'
import { postService } from '../services/posts/post.service'
import { useDispatch, useSelector } from 'react-redux'
import { SET_POSTS } from '../store/posts.reducer'
import { ExplorePost } from './ExplorePost'
import { PostModalView } from '../cmps/post/PostModalView'
import { Comments } from '../cmps/post/PostModal'
import { loadUsers } from '../store/user.actions'
import { loadPosts } from '../store/posts.actions'
// import { ExplorePostModal } from "../cmps/post/ExplorePostModal.jsx"

export function Explore() {
  const loggedInUser = useSelector(s => s.userModule.user)
  const posts = useSelector(s => s.postsModule.posts) || []
  const users = useSelector(s => s.userModule.users) || []
  const [openPostId, setOpenPostId] = useState(null)
  const dispatch = useDispatch()

  async function loadExplorePosts() {
    const posts = await postService.query()
    dispatch({ type: SET_POSTS, posts })
  }

  useEffect(() => {
    loadPosts()
    loadUsers()
    if (posts.length) return
    loadExplorePosts().catch(err => console.log('Cannot load posts', err))
  }, [])

  const shuffled = useMemo(() => {
    const a = [...posts]
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[a[i], a[j]] = [a[j], a[i]]
    }
    return a
  }, [posts])

  const openPost = openPostId ? posts.find(p => p._id === openPostId) : null
  const openPostUser = openPost ? users.find(u => u._id === openPost.userId) : null

  return (
    <div className="explore-container">
      <div className="explore-mid-container">
        {shuffled.map(post => {
          const postUser = users.find(user => user._id === post.userId)
          return (
            <ExplorePost
              key={post._id}
              post={post}
              postUser={postUser}
              onOpen={() => setOpenPostId(post._id)}
            />
          )
        })}
      </div>

      {openPost && (
        <Comments
          post={openPost}
          user={loggedInUser}
          postOwner={openPostUser} // ✅ use correct variable
          onClose={() => setOpenPostId(null)}
        />
      )}
    </div>
  )
}
