import React from 'react';


export function PostsIndex({ posts }) {
  return (
    <div className="feed">
      {posts.map(post => (
        <div key={post.postId} className="post">
          <div className="post-header">
            <img src={post.avatarUrl} alt={`${post.userName}'s avatar`} />
            <div>
              <strong>@{post.userName}</strong>
              <span className="post-date">{new Date(post.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          <div className="post-image">
            <img src={post.imgUrl} alt={post.catName} />
          </div>

          <div className="post-actions">
            <button>❤️</button>
            <button>💬</button>
            <button>📤</button>
          </div>

          <div className="post-likes">
            {post.likes} likes
          </div>

          <div className="post-caption">
            <strong>@{post.userName}</strong> {post.content}
          </div>

          <div className="post-comment">
            Add a comment...
          </div>

          <hr />
        </div>
      ))}
    </div>
  );
}

export default PostsIndex;
