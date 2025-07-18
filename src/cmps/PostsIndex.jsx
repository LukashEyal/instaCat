import React from 'react';
import { Link } from 'react-router-dom'
import { ReactSVG } from 'react-svg'
import { useState } from 'react'

import bookmark from '../assets/svgs/post-container/bookmark.svg'
import comment from '../assets/svgs/post-container/comment.svg'
import emoji from '../assets/svgs/post-container/emoji.svg'
import like from '../assets/svgs/post-container/like.svg'
import liked from '../assets/svgs/post-container/liked.svg'
import love from '../assets/svgs/post-container/love.svg'
import option from '../assets/svgs/post-container/option.svg'
import share from '../assets/svgs/post-container/share.svg'
import verified from '../assets/svgs/post-container/verified.svg'






function PostItem({icon, path, linkTo, onClick}){

   const content = (
    <>
      <ReactSVG src={path} />
      <div className='post-item-name'><span>{icon}</span></div>
    </>
  )

  if (onClick) {
    return (
      <div className="post-item" onClick={onClick}>
        {content}
      </div>
    )
  }

  return (
    <Link to={linkTo} className="post-item">
      {content}
    </Link>
  )

}

export function PostsIndex({ posts }) {



  return (
    
    <div className="feed">
      <hr />
      {posts.map(post => (
        <div key={post.postId} className="post">
          
          <div className="post-header">
            <img src={post.avatarUrl} alt={`${post.userName}'s avatar`} />
            
            <div className='post-user'>
              <span className='post-user-name'>{post.userName}</span>
              <span className='post-created-at'>*{post.createdAt}</span>
              <span className="post-location">{post.location}</span>
              <button className='post-options'><PostItem  path={option}/></button>
            </div>
          </div>
          <div className='post-content'>
          <div className="post-image">
            <img src={post.imgUrl} alt={post.catName} />
          </div>

          <div className="post-actions">

            <button className='like-button'><PostItem path={like}/></button>
            <button className='comment-button'><PostItem path={comment}/></button>
            <button className='share-button'><PostItem path={share}/></button>
            <button className='bookmark-button'><PostItem path={bookmark}/></button>
            {/* {postItems.map((item, index) => <PostItem key={index} {...item} />)} */}

          </div>

          <div className="post-likes">
            {post.likes} likes
          </div>

          <div className="post-caption">
            <strong>@{post.userName}</strong> {post.content}
          </div>

          <div className="post-comment">
      <input
      type="text"
      className="comment-input"
      placeholder="Add a comment..."
/>
  <button className='emoji-button'><PostItem path={emoji}/></button>

          </div>

          <hr />
        </div>

        </div>
      ))}
    </div>
  );
}

export default PostsIndex;
