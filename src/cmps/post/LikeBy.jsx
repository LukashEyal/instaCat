


export function LikeBy({ likeIds = [], currentUser }) {
  const currentUserId = currentUser._id;
  const userLiked = likeIds.includes(currentUserId);

  // Avoid mutating original array length — just adjust display
  const likesCount = likeIds.length;
  const displayCount = userLiked ? likesCount : likesCount;

  if (likesCount === 0) return null;

  return (
    <p>
      {displayCount} {displayCount === 1 ? 'like' : 'likes'}
    </p>
  );
}