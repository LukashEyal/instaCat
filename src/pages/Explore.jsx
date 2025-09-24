// Explore.jsx
import { useEffect, useMemo, useState } from "react"
import { postService } from "../services/posts/post.service"
import { useDispatch, useSelector } from "react-redux"
import { SET_POSTS } from "../store/posts.reducer"
import { ExplorePost } from "./ExplorePost"
import { ExplorePostModal } from "../cmps/post/ExplorePostModal.jsx"

export function Explore() {
  const posts = useSelector((store) => store.postsModule.posts)
  const [openPostId, setOpenPostId] = useState(null)
  const dispatch = useDispatch()

  async function loadExplorePosts() {
    const posts = await postService.query()
    dispatch({ type: SET_POSTS, posts })
  }

  useEffect(() => {
    if (posts.length) return
    loadExplorePosts().catch((err) => console.log("Cannot load posts", err))
  }, [])

  const shuffled = useMemo(() => {
    const a = [...posts]
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[a[i], a[j]] = [a[j], a[i]]
    }
    return a
  }, [posts])

  const openPost = openPostId ? posts.find((p) => p._id === openPostId) : null

  return (
    <div className='explore-container'>
      <div className='explore-mid-container'>
        {shuffled.map((post) => (
          <ExplorePost
            post={post}
            key={post._id}
            onOpen={() => setOpenPostId(post._id)}
          />
        ))}
      </div>

      {openPost && (
        <ExplorePostModal
          post={openPost}
          onBackDropClick={() => setOpenPostId(null)}
        />
      )}
    </div>
  )
}
