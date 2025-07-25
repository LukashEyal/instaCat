import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ReactSVG } from 'react-svg'
import { formatDistanceToNow } from 'date-fns'

import { useSelector } from 'react-redux'
import { toggleLike, getFullNamesFromUserIds, getUserNames } from '../../store/posts.actions.js'






export function LikeBy({ likeIds, currentUser }) {
  const [fullnames, setFullnames] = useState([])

  useEffect(() => {
    if (!Array.isArray(likeIds) || likeIds.length === 0) return

    const loadFullnames = async () => {
      try {
        const result = await getFullNamesFromUserIds(likeIds)
        setFullnames(result)
      } catch (err) {
        console.error('Failed to fetch fullnames', err)
      }
    }

    loadFullnames()
  }, [])

  if (!Array.isArray(likeIds) || likeIds.length === 0) return null

  const isLikedByUser = likeIds.includes(currentUser._id)
  const currentFullname = currentUser.fullname
  const otherNames = fullnames.filter(name => name !== currentFullname)
  
  if (isLikedByUser) {
    if (!otherNames.length) {
      return <p className="like-by">Liked by <strong>you</strong></p>
    }

    return (
      <p className="like-by">
        Liked by <strong>you</strong> and <strong>{otherNames.length} other{otherNames.length > 1 ? 's' : ''}</strong>
      </p>
    )
  }

  if (fullnames.length > 0) {
    const [first, ...rest] = fullnames
    return (
      <p className="like-by">
        Liked by <strong>{first}</strong>
        {rest.length > 0 && <> and <strong>{rest.length} other{rest.length > 1 ? 's' : ''}</strong></>}
      </p>
    )
  }

  return null
}
