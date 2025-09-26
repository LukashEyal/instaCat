import { toggleLikeOptimistic } from '../../store/posts.actions'
import { useEffect, useState } from 'react'

export function LikeBy({ likeIds = [], currentUser, postId, userId, fromHomePage = false }) {
  const currentUserId = currentUser._id
  const userLiked = likeIds.includes(currentUserId)
  const [animate, setAnimate] = useState(false)

  useEffect(() => {
    // Trigger animation whenever likeIds changes
    setAnimate(true)
    const t = setTimeout(() => setAnimate(false), 400) // reset after animation duration
    return () => clearTimeout(t)
  }, [likeIds])

  function onToggleLike(postId, userId) {
    // toggleLike(postId, userId);
    toggleLikeOptimistic(postId, userId)
  }

  // Avoid mutating original array length — just adjust display
  const likesCount = likeIds.length
  const displayCount = userLiked ? likesCount : likesCount
  if (fromHomePage && likesCount === 0)
    return (
      <div className="like-placeholder">
        <p></p>
      </div>
    )
  if (likesCount === 0) {
    return (
      <p>
        Be the first to{' '}
        <p className="in-post-like-this" onClick={() => onToggleLike(postId, userId)}>
          like this
        </p>
      </p>
    )
  }

  return (
    <p className={`like-by ${animate ? 'animate' : ''}`}>
      {displayCount} {displayCount === 1 ? 'like' : 'likes'}
    </p>
  )
}
