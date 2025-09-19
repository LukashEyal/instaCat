import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ReactSVG } from 'react-svg'
import { formatDistanceToNow } from 'date-fns'

import { useSelector } from 'react-redux'
import { toggleLike, getFullNamesFromUserIds, getUserNames } from '../../store/posts.actions.js'

export function PostButton({ icon, path, linkTo, onClick, className = '' }) {
  const content = (
    <>
      <ReactSVG
        src={path}
        beforeInjection={svg => {
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
