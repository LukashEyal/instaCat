import React, { useRef, useEffect, useState } from 'react'
import  PostButton from './RenderPost'
import { formatDistanceToNow } from 'date-fns'
import { toggleLike, getFullNamesFromUserIds, getUserNames } from '../../store/posts.actions'

import RenderPostClicked from './RenderPostClicked'




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
  console.log(post)
  const { user, post_imgUrl, likeBy, content, comments, createdAt } = post

  return (
    <div className="modal-overlay">
      <div className="modal-content" ref={modalRef}>
        
        <RenderPostClicked post={post} user={user} />

          </div>

          

        

    
        </div>
      
 
  )
}
