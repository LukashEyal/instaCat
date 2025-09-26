import { toggleLikeOptimistic } from '../../store/posts.actions'

export function LikeBy({ likeIds = [], currentUser, postId, userId, fromHomePage = false }) {
  const currentUserId = currentUser._id
  const userLiked = likeIds.includes(currentUserId)

  function onToggleLike(postId, userId) {
    toggleLikeOptimistic(postId, userId)
  }

  const likesCount = likeIds.length
  const displayCount = userLiked ? likesCount : likesCount

  if (fromHomePage && likesCount === 0) {
    return (
      <div className="like-placeholder">
        <p></p>
      </div>
    )
  }

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
    <p className="like-by">
      {displayCount} {displayCount === 1 ? 'like' : 'likes'}
    </p>
  )
}
