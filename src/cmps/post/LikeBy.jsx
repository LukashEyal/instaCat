import { toggleLikeOptimistic } from '../../store/posts.actions'

export function LikeBy({
  likeIds = [],
  currentUser,
  postId,
  userId,
  fromHomePage = false,
}) {
  const currentUserId = currentUser._id
  const userLiked = likeIds.includes(currentUserId)

  function onToggleLike(postId, userId) {
    // toggleLike(postId, userId);
    toggleLikeOptimistic(postId, userId)
  }

  // Avoid mutating original array length — just adjust display
  const likesCount = likeIds.length
  const displayCount = userLiked ? likesCount : likesCount

  if (likesCount === 0) {
    return (
      <p>
        Be the first to{' '}
        <span
          className="in-post-like-this"
          onClick={() => onToggleLike(postId, userId)}
        >
          like this
        </span>
      </p>
    )
  }

  return (
    <p className="like-by">
      {displayCount} {displayCount === 1 ? 'like' : 'likes'}
    </p>
  )
}
