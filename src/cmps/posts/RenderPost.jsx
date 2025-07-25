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
import { CommentBy } from './CommentBy.jsx'



export function RenderPost({ post, user }) {
  const [showModal, setShowModal] = useState(false)
  const [selectedComments, setSelectedComments] = useState(null)

  const postAuthor = post.user
  const comments = post.comments

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

      <div className="post-content">
        <div className="post-image">
          <img src={post.post_imgUrl || post.imgUrl} alt="post" />
        </div>

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

        <div className="post-caption">
          <strong>@{postAuthor?.username}</strong> {post.content}
        </div>

        <div className="post-comments">
          <CommentBy
            comments={comments}
            currentUser={user}
            onClick={() => {
              setSelectedComments(post)
              setShowModal(true)
            }}
          />
        </div>

        <div className="post-comment">
          <input
            type="text"
            className="comment-input"
            placeholder="Add a comment..."
          />
          <button className="emoji-button">
            <PostButton path={emoji} />
          </button>
        </div>

        <hr />
      </div>

      {showModal && selectedComments && (
        <CommentsView
          post={selectedComments}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  )
}

export default RenderPost
