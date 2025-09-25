// ./post/AddPost.jsx
import backIcon from '../../assets/svgs/post-container/back.svg'
import upArrow from '../../assets/svgs/post-container/up-arrow.svg'
import downArrow from '../../assets/svgs/post-container/down-arrow.svg'
import locationIcon from '../../assets/svgs/post-container/location.svg'
import collaborator from '../../assets/svgs/post-container/collaborator.svg'
import emojiIcon from '../../assets/svgs/post-container/emoji.svg'

import React, { useEffect, useState, useRef } from 'react'
import { createPortal } from 'react-dom'
import EmojiPicker from 'emoji-picker-react'
import { socketService, SOCKET_EVENT_POST_ADDED } from '../../services/socket.service'

function Section({ title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="section">
      <button className="section-header" onClick={() => setOpen(!open)} aria-expanded={open}>
        <span>{title}</span>
        <span className="chev">
          {open ? <img src={upArrow} alt="" /> : <img src={downArrow} alt="" />}
        </span>
      </button>
      {open && <div className="section-body">{children}</div>}
    </div>
  )
}

/** Same portal pattern you used in PostClicked */
function EmojiPortal({ open, onClose, style, popRef, children }) {
  if (!open) return null

  const handleBackdropDown = e => {
    e.stopPropagation()
    onClose?.()
  }

  return createPortal(
    <div
      className="emoji-backdrop"
      onMouseDown={handleBackdropDown}
      onClick={e => e.stopPropagation()}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="emoji-sheet"
        ref={popRef}
        style={style}
        onMouseDown={e => e.stopPropagation()}
        onClick={e => e.stopPropagation()}
      >
        {children}
      </div>
    </div>,
    document.body
  )
}

export function AddPost({ imageBlob, onBack, onShare, userAvatar, UserFullName }) {
  const [url, setUrl] = useState(null)

  // right-side state
  const [caption, setCaption] = useState('')
  const [location, setLocation] = useState('')
  const [collabInput, setCollabInput] = useState('')
  const [collaborators, setCollaborators] = useState([])
  const [shareTo, setShareTo] = useState({ facebook: false })
  const [altText, setAltText] = useState('')
  const [settings, setSettings] = useState({
    hideLikeCount: false,
    disableComments: false,
  })

  // emoji picker state (borrowed from PostClicked)
  const [showPicker, setShowPicker] = useState(false)
  const [pickerPos, setPickerPos] = useState({ top: 64, left: 0 })
  const emojiBtnRef = useRef(null)
  const emojiPopRef = useRef(null)
  const captionRef = useRef(null)

  useEffect(() => {
    if (!imageBlob) return
    const u = URL.createObjectURL(imageBlob)
    setUrl(u)
    return () => URL.revokeObjectURL(u)
  }, [imageBlob])

  // close picker when clicking outside (same pattern)
  useEffect(() => {
    if (!showPicker) return

    const onDocMouseDown = e => {
      const pop = emojiPopRef.current
      const btn = emojiBtnRef.current
      if (!pop || !btn) return
      const clickedInsidePop = pop.contains(e.target)
      const clickedButton = btn.contains(e.target)
      if (!clickedInsidePop && !clickedButton) setShowPicker(false)
    }

    document.addEventListener('mousedown', onDocMouseDown)
    return () => document.removeEventListener('mousedown', onDocMouseDown)
  }, [showPicker])

  const addCollaborator = () => {
    const v = collabInput.trim()
    if (!v) return
    if (!collaborators.includes(v)) setCollaborators(arr => [...arr, v])
    setCollabInput('')
  }
  const removeCollaborator = name => setCollaborators(arr => arr.filter(n => n !== name))

  const handleShare = e => {
    e.preventDefault()
    onShare?.({
      blob: imageBlob,
      caption,
      location,
      collaborators,
      shareTo,
      altText,
      settings,
    })
  }

  return (
    <>
      <div className="create-post-header crop-header">
        <div className="header-left">
          <button className="back-btn" onClick={onBack} aria-label="Back">
            <img src={backIcon} alt="" />
          </button>
        </div>
        <div className="header-title">Create new post</div>
        <div className="header-right">
          <button className="next-btn" onClick={handleShare}>
            Share
          </button>
        </div>
      </div>

      <div className="add-post-body">
        <div className="cropped-image">{url && <img src={url} alt="Cropped" />}</div>

        {/* RIGHT SIDE */}
        <aside className="compose-right">
          <div className="account-row">
            <div className="avatar">
              <img src={userAvatar} alt="" />
            </div>
            <div className="account-name">{UserFullName}</div>
          </div>

          {/* caption with emoji button + counter */}
          <div className="caption-wrap">
            <textarea
              ref={captionRef}
              aria-label="Caption"
              maxLength={2200}
              value={caption}
              onChange={e => setCaption(e.target.value)}
            />

            <div className="emoji-counter-div">
              <button
                type="button"
                className="emoji-button"
                ref={emojiBtnRef}
                title="Add emoji"
                onClick={() => {
                  const r = emojiBtnRef.current.getBoundingClientRect()
                  const PICKER_W = 320
                  const PICKER_H = 380
                  const GAP = 8
                  const left = Math.min(
                    Math.max(8, r.right - PICKER_W),
                    window.innerWidth - PICKER_W - 8
                  )
                  const top = Math.max(8, r.top - PICKER_H - GAP)
                  setPickerPos({ top, left })
                  setShowPicker(v => !v)
                }}
              >
                <img src={emojiIcon} alt="" />
              </button>

              <div className="counter">{caption.length}/2200</div>
            </div>

            {/* Emoji portal (same behavior as PostClicked) */}
            <EmojiPortal
              open={showPicker}
              onClose={() => setShowPicker(false)}
              style={{ top: pickerPos.top, left: pickerPos.left }}
              popRef={emojiPopRef}
            >
              <EmojiPicker
                emojiStyle="facebook"
                previewConfig={{ showPreview: false }}
                height={380}
                width={320}
                onEmojiClick={emojiData => {
                  setCaption(t => t + emojiData.emoji)
                  requestAnimationFrame(() => captionRef.current?.focus())
                }}
              />
            </EmojiPortal>
          </div>

          <hr className="caption-divider" />

          {/* location */}
          <div className="location">
            <input
              className="location-input"
              type="text"
              placeholder="Add Location"
              value={location}
              onChange={e => setLocation(e.target.value)}
            />
            <button className="location-button" type="button">
              <img src={locationIcon} alt="" />
            </button>
          </div>

          {/* collaborators */}
          <div className="collab-input">
            <input
              type="text"
              placeholder="Add collaborators"
              value={collabInput}
              onChange={e => setCollabInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addCollaborator()}
            />
            <button className="collab-btn" type="button" onClick={addCollaborator}>
              <img src={collaborator} alt="" />
            </button>
          </div>

          {!!collaborators.length && (
            <ul className="collab-list">
              {collaborators.map(name => (
                <li key={name}>
                  <span>@{name}</span>
                  <button
                    type="button"
                    onClick={() => removeCollaborator(name)}
                    aria-label={`Remove ${name}`}
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          )}

          {/* share to */}
          <Section title="Share to">
            <label className="toggle">
              <input
                type="checkbox"
                checked={shareTo.facebook}
                onChange={e => setShareTo(s => ({ ...s, facebook: e.target.checked }))}
              />
              <span>Facebook</span>
            </label>
          </Section>

          {/* accessibility */}
          <Section title="Accessibility">
            <label className="field-label">Alt text</label>
            <textarea
              placeholder="Write alt text for your photo"
              value={altText}
              onChange={e => setAltText(e.target.value)}
            />
          </Section>

          {/* advanced */}
          <Section title="Advanced settings">
            <label className="toggle">
              <input
                type="checkbox"
                checked={settings.hideLikeCount}
                onChange={e =>
                  setSettings(s => ({
                    ...s,
                    hideLikeCount: e.target.checked,
                  }))
                }
              />
              <span>Hide like counts</span>
            </label>
            <label className="toggle">
              <input
                type="checkbox"
                checked={settings.disableComments}
                onChange={e =>
                  setSettings(s => ({
                    ...s,
                    disableComments: e.target.checked,
                  }))
                }
              />
              <span>Turn off commenting</span>
            </label>
          </Section>
        </aside>
      </div>
    </>
  )
}
