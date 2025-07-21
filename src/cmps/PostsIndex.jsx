import React from 'react'
import { Link } from 'react-router-dom'
import { ReactSVG } from 'react-svg'
import { formatDistanceToNow } from 'date-fns'
import { postService } from '../services/posts/post.service'

import { useDispatch } from 'react-redux'
import { toggleLike } from '../store/posts.actions'

import bookmark from '../assets/svgs/post-container/bookmark.svg'
import comment from '../assets/svgs/post-container/comment.svg'
import emoji from '../assets/svgs/post-container/emoji.svg'
import like from '../assets/svgs/post-container/like.svg'
import liked from '../assets/svgs/post-container/liked.svg'
import love from '../assets/svgs/post-container/love.svg'
import option from '../assets/svgs/post-container/option.svg'
import share from '../assets/svgs/post-container/share.svg'
import verified from '../assets/svgs/post-container/verified.svg'

function PostItem({ icon, path, linkTo, onClick, className = '' }) {
  const content = (
    <>
      <ReactSVG
        src={path}
        beforeInjection={(svg) => {
          if (className) svg.classList.add(className)
        }}
      />
      <div className="post-item-name">
        <span>{icon}</span>
      </div>
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

export function PostsIndex({ posts, users, user }) {
  const dispatch = useDispatch()

  function onToggleLike(postId) {
    postService
      .toggleLike(postId, user._id)
      .then((updatedPost) => {
        dispatch({ type: 'UPDATE_POST', post: updatedPost }) // plain object ✅
      })
      .catch((err) => {
        console.error('Failed to toggle like', err)
      })
  }

  return (
    <div className="feed">
      {posts.map((post) => {
        const postAuthor = users.find((u) => u._id === post.userId)

        return (
          <div key={post._id} className="post">
            <div className="post-header">
              <img
                src={postAuthor?.avatarUrl}
                alt={`${postAuthor?.username}'s avatar`}
              />

              <div className="post-user-details">
                <div className="post-user-meta">
                  <span className="post-user-name">{postAuthor?.username}</span>
                  <span className="post-created-at">
                    •{' '}
                    {formatDistanceToNow(new Date(post.createdAt), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
                <div className="post-location">{post.location}</div>
              </div>

              <button className="post-options">
                <PostItem path={option} />
              </button>
            </div>

            <div className="post-content">
              <div className="post-image">
                <img src={post.post_imgUrl || post.imgUrl} alt="post image" />
              </div>
              <div className="post-actions">
                <button
                  className="like-button"
                  onClick={() => onToggleLike(post._id)}
                >
                  <PostItem
                    path={post.likeBy.includes(user._id) ? liked : like}
                    className={
                      post.likeBy.includes(user._id) ? 'liked-icon' : ''
                    }
                  />
                </button>

                <button className="comment-button">
                  <PostItem path={comment} />
                </button>
                <button className="share-button">
                  <PostItem path={share} />
                </button>
                <button className="bookmark-button">
                  <PostItem path={bookmark} />
                </button>
              </div>

              <div className="post-likes">{post.likes} likes</div>

              <div className="post-caption">
                <strong>@{postAuthor?.username}</strong> {post.content}
              </div>

              <div className="post-comment">
                <input
                  type="text"
                  className="comment-input"
                  placeholder="Add a comment..."
                />
                <button className="emoji-button">
                  <PostItem path={emoji} />
                </button>
              </div>

              <hr />
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default PostsIndex
