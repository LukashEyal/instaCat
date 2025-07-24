import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ReactSVG } from 'react-svg'
import { formatDistanceToNow } from 'date-fns'

import { useSelector } from 'react-redux'
import { toggleLike, getFullnamesFromUserIds, getUserNames } from '../store/posts.actions'

import bookmark from '../assets/svgs/post-container/bookmark.svg'
import comment from '../assets/svgs/post-container/comment.svg'
import emoji from '../assets/svgs/post-container/emoji.svg'
import like from '../assets/svgs/post-container/like.svg'
import liked from '../assets/svgs/post-container/liked.svg'
import love from '../assets/svgs/post-container/love.svg'
import option from '../assets/svgs/post-container/option.svg'
import share from '../assets/svgs/post-container/share.svg'
import verified from '../assets/svgs/post-container/verified.svg'
import { CommentsView } from './CommentsView'





function PostButton({ icon, path, linkTo, onClick, className = '' }) {
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

// LikeBy component: handles its own fetching
function LikeBy({ likeIds, currentUser }) {
  const [fullnames, setFullnames] = useState([])

  useEffect(() => {
    if (!Array.isArray(likeIds) || likeIds.length === 0) return

    const loadFullnames = async () => {
      try {
        const result = await getFullnamesFromUserIds(likeIds)
        setFullnames(result)
      } catch (err) {
        console.error('Failed to fetch fullnames', err)
      }
    }

    loadFullnames()
  }, [likeIds])

  if (!Array.isArray(likeIds) || likeIds.length === 0) return null

  const isLikedByUser = likeIds.includes(currentUser._id)
  const currentFullname = currentUser.fullname
  const otherNames = fullnames.filter(name => name !== currentFullname)

  if (isLikedByUser) {
    if (!otherNames.length) {
      return <p>Liked by <strong>you</strong></p>
    }
    return (
      <p>
        Liked by <strong>you</strong> and <strong>{otherNames.length} other{otherNames.length > 1 ? 's' : ''}</strong>
      </p>
    )
  }

  if (fullnames.length > 0) {
    const [first, ...rest] = fullnames
    return (
      <p>
        Liked by <strong>{first}</strong>
        {rest.length > 0 && <> and <strong>{rest.length} other{rest.length > 1 ? 's' : ''}</strong></>}
      </p>
    )
  }

  return null
}



function CommentBy({ comments, currentUser, onClick }) {
  const [usernames, setUserNames] = useState([])
  

  const commentUserIds = comments.map(comment => comment.userId)

  useEffect(() => {
    if (!Array.isArray(commentUserIds) || commentUserIds.length === 0) return

    const loadUserNames = async () => {
      try {
        const result = await getUserNames(commentUserIds)
        setUserNames(result)
      } catch (err) {
        console.error('Failed to fetch fullnames', err)
      }
    }

    loadUserNames()
  }, [comments])

  if (!usernames.length) return null

  const currentFullname = currentUser.fullname
  const others = usernames.filter(name => name !== currentFullname)

  return (
    <button className="view-comments-btn" onClick={onClick}>
      View all{' '}
      {usernames.includes(currentFullname) && <strong>you</strong>}
      {others.length > 0 && (
        <>
          {usernames.includes(currentFullname) && ' and '}
          {others.length} comment{others.length > 1 ? 's' : ''}
        </>
      )}
    </button>
  )
}


export function Post({ user }) {
    const [showModal, setShowModal] = useState(false)
    const [selectedComments, setSelectedComments] = useState([])
  
  const posts = useSelector(store => store.postsModule.posts)

  function onToggleLike(postId, userId) {
    toggleLike(postId, userId)
  }

  return (
    <div className="feed">
      {posts.map((post) => {
        const postAuthor = post.user
        const comments = post.comments
        
       
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
          </div>
          
        )
      })}
   {showModal && (
  <CommentsView
    post={selectedComments} // this is now the full post
    onClose={() => setShowModal(false)}
  />
)}
    </div>
  )
}

export default Post
