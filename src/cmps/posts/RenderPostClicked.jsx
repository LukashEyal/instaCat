import React, { useState } from 'react'
import { formatDistanceToNow } from 'date-fns'

import { toggleLike } from '../../store/posts.actions.js'

import bookmark from '../../assets/svgs/post-container/bookmark.svg'
import comment from '../../assets/svgs/post-container/comment.svg'
import emoji from '../../assets/svgs/post-container/emoji.svg'
import like from '../../assets/svgs/post-container/like.svg'
import liked from '../../assets/svgs/post-container/liked.svg'
import option from '../../assets/svgs/post-container/option.svg'
import share from '../../assets/svgs/post-container/share.svg'

import { CommentsView } from './CommentsView.jsx'
import { PostButton } from './PostButton.jsx'
import { LikeBy } from './LikeBy.jsx'
import { Comments } from './Comments.jsx'



export function RenderPostClicked({ post, user }) {
  const [showModal, setShowModal] = useState(false)
  const [selectedComments, setSelectedComments] = useState(null)

  const postAuthor = post.user
  const comments = post.comments
  console.log(comments)
  function onToggleLike(postId, userId) {
    toggleLike(postId, userId)
  }

  return (
    <div className="post">
      <div className="post-header">
        <img
          src={postAuthor?.avatarUrl}
          alt={`${postAuthor?.username}'s avatar`}
        />
        <div className="post-user-details">
          <div className="post-user-meta">
            <span className="post-user-name">{postAuthor?.username}</span>
            <span className="post-created-at">
              • {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
            </span>
          </div>
          <div className="post-location">{post.location}</div>
        </div>
        <button className="post-options">
          <PostButton path={option} />
        </button>
      </div>
 <div className="post-image">
          <img src={post.post_imgUrl || post.imgUrl} alt="post" />
        </div>
      <div className="user-post">
            
            <div className="user-avatar">
               <img
          src={postAuthor?.avatarUrl}
          alt={`${postAuthor?.username}'s avatar`}
          
        /></div>
        <span className="user-name">{postAuthor?.username}</span>
             <span className='user-post-content'>{post.content}</span>
        
        </div>

           <div className="post-comments">

            <Comments comments={comments} />
       
        </div>
       
        <div className='actions'>
        <div className="post-actions">
          <button className="like-button">
            <PostButton
              onClick={() => onToggleLike(post._id, user._id)}
              path={post.likeBy.includes(user._id) ? liked : like}
              className={post.likeBy.includes(user._id) ? 'liked-icon' : ''}
            />
          </button>
          <button className="comment-button">
            <PostButton path={comment} />
          </button>
          <button className="share-button">
            <PostButton path={share} />
          </button>
          <button className="bookmark-button">
            <PostButton path={bookmark} />
          </button>
        </div>

        <div className="post-likes">
          <LikeBy likeIds={post.likeBy} currentUser={user} />
        </div>

    
     

    <div className="post-comment">
  <input
    type="text"
    className="comment-input"
    placeholder="Add a comment..."
    onFocus={() => {
      setSelectedComments(post) // or whichever post data you want to pass
      setShowModal(true)
    }}
  />
  <button className="emoji-button">
    <PostButton path={emoji} />
  </button>
</div>

<hr />
     

      {showModal && selectedComments && (
        <CommentsView
          post={post}
          onClose={() => setShowModal(false)}
          user={user}
        />
      )}
   </div>
   </div>
  )
}


export default RenderPostClicked
