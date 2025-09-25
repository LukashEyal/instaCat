// ExplorePost.jsx
export function ExplorePost({ post, onOpen }) {
  return (
    <div className='explore-post' onClick={onOpen}>
      <img
        src={post.imageUrl}
        alt='Explore Post'
        className='explore-post-image'
      />
      <div className='explore-post-overlay'>
        <span>❤️ {post.likeBy.length ?? 0}</span>
        <span>💬 {post.comments.length ?? 0}</span>
      </div>
    </div>
  )
}
