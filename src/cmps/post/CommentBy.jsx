import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ReactSVG } from 'react-svg'
import { formatDistanceToNow } from 'date-fns'

import { useSelector } from 'react-redux'
import { toggleLike, getFullNamesFromUserIds, getUserNames } from '../../store/posts.actions.js'




export function CommentBy({ comments = [], onClick }) {
  const count = comments.length

  if (count === 0) {
    return <p className="no-comments">No comments yet</p>
  }

  const label = count === 1 ? "Comment" : "Comments"

  return (
    <button className="view-comments-btn" onClick={onClick}>
      View all {count} {label}
    </button>
  )
}


  // const [usernames, setUserNames] = useState([])
  // const [postComments, setPostComments] = useState([comments])


  

  // const commentUserIds = comments.map(comment => comment.userId)

  // useEffect(() => {
  //   if (!Array.isArray(commentUserIds) || commentUserIds.length === 0) return

  //   const loadUserNames = async () => {
  //     try {
  //       const result = await getUserNames(commentUserIds)
  //       setUserNames(result)
  //     } catch (err) {
  //       console.error('Failed to fetch fullnames', err)
  //     }
  //   }

  //   loadUserNames()
  // }, [comments])

  // if (!usernames.length) return null

  // const currentFullname = currentUser.fullname
  // const others = usernames.filter(name => name !== currentFullname)


