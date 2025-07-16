import React from 'react';

export function PostsIndex({posts}){
  return (
    <div>
      {posts.map(post => (
        <div key={post.postId}>
          <h2>{post.userName}</h2>
          <p>{post.location}</p>
          <p>{new Date(post.createdAt).toLocaleString()}</p>
          <p>{post.content}</p>
          <hr />
        </div>
      ))}
    </div>
  );
};

export default PostsIndex;
