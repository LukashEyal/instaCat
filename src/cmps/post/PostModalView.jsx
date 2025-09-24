import React, { useState, useRef, useEffect } from "react"
import { formatDistanceToNow } from "date-fns"
import EmojiPicker from "emoji-picker-react"
import { createPortal } from "react-dom"
import emoji from "../../assets/svgs/post-container/emoji.svg"
import { toggleLikeOptimistic } from "../../store/posts.actions.js"

import bookmark from "../../assets/svgs/post-container/bookmark.svg"
import comment from "../../assets/svgs/post-container/comment.svg"
import avatarPlaceHolder from "../../assets/svgs/post-container/avatar-placeholder.svg"

import like from "../../assets/svgs/post-container/like.svg"
import unlike from "../../assets/svgs/post-container/unlike.svg"
import option from "../../assets/svgs/post-container/option.svg"
import share from "../../assets/svgs/post-container/share.svg"

import { PostButton } from "./PostButton.jsx"
import { LikeBy } from "./LikeBy.jsx"
import { Comments } from "./Comments.jsx"
import { AddComment } from "./AddComment.jsx"

export function PostModalView({ post, user, postOwner }) {
  const [showModal, setShowModal] = useState(false)
  const [selectedComments, setSelectedComments] = useState(null)
  const [ShowPicker, setShowPicker] = useState(false)
  const [pickerPos, setPickerPos] = useState({ top: 64, left: 0 })
  const emojiBtnRef = useRef(null)
  const emojiPopRef = useRef(null)

  function setFocus(ref) {
    ref.current?.focus()
  }

  const postAuthor = postOwner
  const postId = post._id
  const comments = post.comments

  // Controlled input for AddComment (so we can inject emojis)
  const [commentText, setCommentText] = useState("")
  const inputRef = useRef(null)
  const canPost = commentText.trim().length > 0

  function EmojiPortal({ open, onClose, children, style, popRef }) {
    if (!open) return null

    const handleBackdropDown = (e) => {
      // prevent the modal's outside-click handler from seeing this event
      e.stopPropagation()
      onClose()
    }

    return createPortal(
      <div
        className='emoji-backdrop'
        onMouseDown={handleBackdropDown}
        onClick={(e) => e.stopPropagation()}
        role='dialog'
        aria-modal='true'
      >
        <div
          className='emoji-sheet'
          ref={popRef}
          style={style}
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
        >
          {children}
        </div>
      </div>,
      document.body
    )
  }

  useEffect(() => {
    if (!ShowPicker) return
    const onDocMouseDown = (e) => {
      const pop = emojiPopRef.current
      const btn = emojiBtnRef.current
      if (!pop || !btn) return
      const clickedInsidePop = pop.contains(e.target)
      const clickedButton = btn.contains(e.target)
      if (!clickedInsidePop && !clickedButton) {
        setShowPicker(false)
      }
    }
    document.addEventListener("mousedown", onDocMouseDown)
    return () => document.removeEventListener("mousedown", onDocMouseDown)
  }, [ShowPicker])

  function onToggleLike(thePostId, userId) {
    toggleLikeOptimistic(thePostId, userId)
  }

  return (
    <div className='modal-post'>
      <div className='modal-post-header'>
        <img
          src={postAuthor?.avatarUrl || avatarPlaceHolder}
          alt={`${postAuthor?.username}'s avatar`}
        />
        <div className='modal-post-user-details'>
          <div className='modal-post-user-meta'>
            <span className='post-user-name'>{postAuthor?.username}</span>
          </div>
          <div className='post-location'>{post.location}</div>
        </div>
        <button className='post-options'>
          <PostButton path={option} />
        </button>
      </div>

      <div className='modal-post-image'>
        <img src={post.imageUrl || post.imgUrl} alt='post' />
      </div>

      <div className='modal-user-post'>
        <div className='modal-user-post-header'>
          <div className='modal-avatar'>
            <img
              src={postAuthor?.avatarUrl || avatarPlaceHolder}
              alt={`${postAuthor?.username}'s avatar`}
            />
          </div>

          {/* caption body */}
          <div className='modal-caption'>
            <span className='caption-line'>
              <strong className='user-name'>{postAuthor?.username}</strong>{" "}
              <span className='caption-text'>{post.content}</span>
            </span>
            {/* optional: timestamp under caption
            <span className="caption-time">
              {formatDistanceToNow(new Date(post.createAt), { addSuffix: true })}
            </span> */}
          </div>
        </div>
      </div>

      <div className='modal-post-comments'>
        <Comments comments={comments} />
      </div>

      <div className='modal-actions'>
        <div className='modal-post-actions'>
          <button className='like-button'>
            <PostButton
              onClick={() => onToggleLike(post._id, user._id)}
              path={post.likeBy.includes(user._id) ? unlike : like}
              className={post.likeBy.includes(user._id) ? "unlike-icon" : ""}
            />
          </button>
          <button className='comment-button' onClick={() => setFocus(inputRef)}>
            <PostButton path={comment} />
          </button>
          <button className='share-button'>
            <PostButton path={share} />
          </button>
          <button className='bookmark-button'>
            <PostButton path={bookmark} />
          </button>
        </div>

        <div className='modal-post-likes'>
          <LikeBy
            likeIds={post.likeBy}
            currentUser={user}
            postId={post._id}
            userId={user._id}
          />
        </div>

        <span className='post-created-at'>
          {formatDistanceToNow(new Date(post.createAt), {
            addSuffix: true,
          }).replace(/^about\s+/, "")}
        </span>

        <div
          className={`modal-post-comment ${
            commentText.trim() ? "is-filled" : ""
          }`}
        >
          <button
            type='button'
            className='emoji-button'
            ref={emojiBtnRef}
            onClick={() => {
              const r = emojiBtnRef.current.getBoundingClientRect()
              const PICKER_W = 320,
                PICKER_H = 380,
                GAP = 8
              const left = Math.min(
                Math.max(8, r.right - PICKER_W),
                window.innerWidth - PICKER_W - 8
              )
              const top = Math.max(8, r.top - PICKER_H - GAP)
              setPickerPos({ top, left })
              setShowPicker((v) => !v)
            }}
            aria-expanded={ShowPicker}
            title='Add emoji'
          >
            <PostButton path={emoji} />
          </button>

          {/* Use ONLY AddComment; it provides the Post button */}
          <AddComment
            postId={postId}
            userId={user._id}
            text={commentText}
            onChange={setCommentText}
            inputRef={inputRef}
            canSubmit={canPost}
          />

          <EmojiPortal
            open={ShowPicker}
            onClose={() => setShowPicker(false)}
            style={{ top: pickerPos.top, left: pickerPos.left }}
            popRef={emojiPopRef}
          >
            <EmojiPicker
              emojiStyle='facebook'
              previewConfig={{ showPreview: false }}
              height={380}
              width={320}
              onEmojiClick={(e) => {
                setCommentText((t) => t + e.emoji)
                requestAnimationFrame(() => inputRef.current?.focus())
              }}
            />
          </EmojiPortal>
        </div>
      </div>

      <hr />

      {showModal && selectedComments && (
        <Comments
          comments={comments}
          onClose={() => setShowModal(false)}
          user={user}
        />
      )}
    </div>
  )
}

export default PostModalView
