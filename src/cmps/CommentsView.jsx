import React, { useRef, useEffect, useState } from 'react'
import  PostButton from './Post'
import { formatDistanceToNow } from 'date-fns'
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


export function CommentsView({ post, onClose }) {
  const modalRef = useRef()

  const handleClickOutside = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose()
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  if (!post) return null

  const { user, post_imgUrl, likeBy, content, comments, createdAt } = post

  return (
    <div className="modal-overlay">
      <div className="modal-content" ref={modalRef}>
        

        <div className="post">
            <div className="post-image">
                
            <img src={post_imgUrl} alt="Post" />
          </div>

        <div className='comments'>
          <div className="header">
            
            <img src={user?.avatarUrl} alt="avatar" />
            <strong>{user?.username}</strong>

            </div>
         
              
             


            <div className="comment-section">
                <div className='user-content'>
                 <img src={user?.avatarUrl} alt="avatar" />
              <strong>{user?.username}</strong> {content}
              </div>
            {comments?.map((comment, idx) => (
              <div key={idx} className="comment-row">
                <p><strong>{comment.by?.fullname}</strong> {comment.txt}</p>
                <small>{formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}</small>
              </div>
            ))}
          </div>
          </div>
              {/* <span className="post-created-at">
                • {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
              </span> */}
            </div>
          </div>

          

        

    
        </div>
      
 
  )
}
