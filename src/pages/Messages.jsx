import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import EmojiPicker from 'emoji-picker-react'
import { useDispatch, useSelector } from 'react-redux'
import { loadMsgs, sendMsg, getActionSentMsg } from '../store/msg.actions'
import { loadUser, loadUsers } from '../store/user.actions'
import { socketService, SOCKET_EVENT_ADD_MSG } from '../services/socket.service'
import { SOCKET_EMIT_SEND_MSG } from '../services/socket.service'
import emojiIcon from '../assets/svgs/post-container/emoji.svg' // ← adjust path if needed

/* Reusable Emoji Portal (same idea as in AddPost) */
function EmojiPortal({ open, onClose, style, popRef, children }) {
  if (!open) return null
  const onBackdropDown = e => {
    e.stopPropagation()
    onClose?.()
  }
  return createPortal(
    <div
      className="emoji-backdrop"
      onMouseDown={onBackdropDown}
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

export function Messages() {
  const dispatch = useDispatch()
  const loggedInUser = useSelector(s => s.userModule.user)
  const users = useSelector(s => s.userModule.users) || []
  const rawMsgs = useSelector(s => s.msgModule.msgs) || []

  const [activeUserId, setActiveUserId] = useState(null)
  const [draft, setDraft] = useState('')
  const [search, setSearch] = useState('')

  const endRef = useRef(null)
  const inputRef = useRef(null)

  // emoji picker state (borrowed from AddPost)
  const [showPicker, setShowPicker] = useState(false)
  const [pickerPos, setPickerPos] = useState({ top: 64, left: 0 })
  const emojiBtnRef = useRef(null)
  const emojiPopRef = useRef(null)

  useEffect(() => {
    loadUser()
  }, [])

  useEffect(() => {
    if (!loggedInUser?._id) return
    loadUsers()
    loadMsgs(loggedInUser._id)

    const onIncoming = msg => {
      const norm = {
        ...msg,
        from: msg.from ?? msg.byUserId ?? msg.senderId,
        to: msg.to ?? msg.toUserId ?? msg.recipientId,
      }
      dispatch(getActionSentMsg(norm))
    }
    socketService.on(SOCKET_EVENT_ADD_MSG, onIncoming)
    return () => socketService.off(SOCKET_EVENT_ADD_MSG, onIncoming)
  }, [loggedInUser?._id, dispatch])

  // close picker on outside click
  useEffect(() => {
    if (!showPicker) return
    const onDocDown = e => {
      const pop = emojiPopRef.current
      const btn = emojiBtnRef.current
      if (!pop || !btn) return
      const insidePop = pop.contains(e.target)
      const onBtn = btn.contains(e.target)
      if (!insidePop && !onBtn) setShowPicker(false)
    }
    document.addEventListener('mousedown', onDocDown)
    return () => document.removeEventListener('mousedown', onDocDown)
  }, [showPicker])

  const msgs = useMemo(() => {
    const clean = v => (typeof v === 'string' ? v.trim() : v)
    return rawMsgs.map(m => ({
      ...m,
      from: clean(m.from ?? m.byUserId ?? m.senderId),
      to: clean(m.to ?? m.toUserId ?? m.recipientId),
    }))
  }, [rawMsgs])

  useEffect(() => {
    if (!activeUserId && users.length && loggedInUser?._id) {
      const firstOther = users.find(u => u._id !== loggedInUser._id)
      if (firstOther) setActiveUserId(firstOther._id)
    }
  }, [users, activeUserId, loggedInUser?._id])

  const convos = useMemo(
    () => users.filter(u => u._id !== loggedInUser?._id),
    [users, loggedInUser?._id]
  )

  const convosWithPreview = useMemo(() => {
    const reversed = [...msgs].reverse()
    return convos.map(u => ({
      ...u,
      _lastMsg: reversed.find(
        m =>
          (m.from === u._id && m.to === loggedInUser?._id) ||
          (m.from === loggedInUser?._id && m.to === u._id)
      ),
    }))
  }, [convos, msgs, loggedInUser?._id])

  const searchQ = search.trim().toLowerCase()
  const filteredConvos = useMemo(() => {
    if (!searchQ) return convosWithPreview
    return convosWithPreview.filter(u => {
      const name = (u.username || '').toLowerCase()
      const full = (u.fullname || u.fullName || '').toLowerCase()
      const lastTxt = (u._lastMsg?.txt || '').toLowerCase()
      if (name.includes(searchQ) || full.includes(searchQ) || lastTxt.includes(searchQ)) return true
      let seen = 0
      for (let i = msgs.length - 1; i >= 0 && seen < 300; i--) {
        const m = msgs[i]
        const inThread =
          (m.from === u._id && m.to === loggedInUser?._id) ||
          (m.from === loggedInUser?._id && m.to === u._id)
        if (inThread) {
          seen++
          if ((m.txt || '').toLowerCase().includes(searchQ)) return true
        }
      }
      return false
    })
  }, [convosWithPreview, msgs, loggedInUser?._id, searchQ])

  const threadMsgs = useMemo(() => {
    if (!activeUserId || !loggedInUser?._id) return []
    return msgs.filter(
      m =>
        (m.from === loggedInUser._id && m.to === activeUserId) ||
        (m.from === activeUserId && m.to === loggedInUser._id)
    )
  }, [msgs, activeUserId, loggedInUser?._id])

  useEffect(() => endRef.current?.scrollIntoView({ behavior: 'smooth' }), [threadMsgs.length])

  async function onSend(e) {
    e.preventDefault()
    if (!draft.trim() || !activeUserId || !loggedInUser?._id) return
    const txt = draft.trim()

    try {
      const saved = await sendMsg({ toUserId: activeUserId, fromUserId: loggedInUser._id, txt })
      const normalized = {
        ...saved,
        txt,
        from: saved.from ?? saved.byUserId ?? loggedInUser._id,
        to: saved.to ?? saved.toUserId ?? activeUserId,
        createdAt: saved.createdAt ?? new Date().toISOString(),
      }
      dispatch(getActionSentMsg(normalized))
      socketService.emit(SOCKET_EMIT_SEND_MSG, {
        _id: normalized._id,
        from: normalized.from,
        to: normalized.to,
        txt: normalized.txt,
        createdAt: normalized.createdAt,
      })
      setDraft('')
    } catch (err) {
      console.error('sendMsg failed', err)
    }
  }

  // Insert emoji at caret position inside the input
  function insertEmojiAtCaret(emojiChar) {
    const el = inputRef.current
    if (!el) {
      setDraft(d => d + emojiChar)
      return
    }
    const start = el.selectionStart ?? draft.length
    const end = el.selectionEnd ?? draft.length
    const next = draft.slice(0, start) + emojiChar + draft.slice(end)
    setDraft(next)
    requestAnimationFrame(() => {
      el.focus()
      const pos = start + emojiChar.length
      el.setSelectionRange(pos, pos)
    })
  }

  function onSearchKeyDown(e) {
    if (e.key === 'Enter') {
      const first = filteredConvos[0]
      if (first) setActiveUserId(first._id)
    } else if (e.key === 'Escape') {
      setSearch('')
    }
  }

  const activeUser =
    filteredConvos.find(u => u._id === activeUserId) || convos.find(u => u._id === activeUserId)

  return (
    <section className="dm">
      {/* Sidebar */}
      <aside className="dm__sidebar">
        <header className="dm__me">
          <div className="dm__me-info">
            <img
              className="dm__avatar-me"
              src={loggedInUser?.avatarUrl || '/img/avatar-placeholder.png'}
              alt={loggedInUser?.username || 'Me'}
            />
            <span className="dm__me-username">{loggedInUser?.username || 'Me'}</span>
          </div>
          <button className="dm__new" title="New message">
            ✚
          </button>
        </header>

        <div className="dm__search">
          <input
            placeholder="Search"
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={onSearchKeyDown}
            aria-label="Search conversations"
          />
        </div>

        <div className="dm__list" role="list">
          {filteredConvos.length === 0 && (
            <div style={{ padding: '16px', color: '#8e8e8e', fontSize: 13 }}>No results</div>
          )}

          {filteredConvos.map(u => (
            <button
              key={u._id}
              className={`dm__item ${u._id === activeUserId ? 'is-active' : ''}`}
              onClick={() => setActiveUserId(u._id)}
            >
              <img
                className="dm__avatar"
                src={u.avatarUrl || u.avatar || '/img/avatar-placeholder.png'}
                alt=""
              />
              <span className="dm__name">{u.username}</span>
              <span className="dm__preview">
                {u._lastMsg?.txt ||
                  msgs
                    .slice()
                    .reverse()
                    .find(
                      m =>
                        (m.from === u._id && m.to === loggedInUser?._id) ||
                        (m.from === loggedInUser?._id && m.to === u._id)
                    )?.txt ||
                  'Say hi 👋'}
              </span>
            </button>
          ))}
        </div>
      </aside>

      {/* Chat pane */}
      <main className="dm__pane">
        {activeUser ? (
          <>
            <header className="dm__header">
              <div className="dm__header-left">
                <img
                  className="dm__avatar-header"
                  src={activeUser.avatarUrl || activeUser.avatar || '/img/avatar-placeholder.png'}
                  alt=""
                />
                <div>
                  <div className="dm__title">{activeUser.username}</div>
                  <div className="dm__subtitle">Active now</div>
                </div>
              </div>
              <div className="dm__header-actions">
                <button title="Info">ⓘ</button>
              </div>
            </header>

            <div className="dm__thread">
              {threadMsgs.length === 0 && (
                <div className="dm__empty">
                  <div className="dm__empty-icon">💬</div>
                  <div className="dm__empty-title">Your messages</div>
                  <div className="dm__empty-sub">Send a message to start a chat.</div>
                </div>
              )}

              {threadMsgs.map(m => {
                const mine = m.from === loggedInUser?._id
                return (
                  <div
                    key={m._id || m.id || m.createdAt}
                    className={`msg ${mine ? 'msg--out' : 'msg--in'}`}
                  >
                    {!mine && (
                      <img
                        className="dm__avatar msg__avatar"
                        src={
                          activeUser.avatarUrl || activeUser.avatar || '/img/avatar-placeholder.png'
                        }
                        alt=""
                      />
                    )}
                    <div className="msg__bubble">{m.txt}</div>
                  </div>
                )
              })}
              <div ref={endRef} />
            </div>

            <form className="dm__composer" onSubmit={onSend}>
              <input
                ref={inputRef}
                value={draft}
                onChange={e => setDraft(e.target.value)}
                placeholder="Message..."
                aria-label="Message"
              />

              <div className="dm__composer-actions">
                {/* Emoji button opens anchored picker */}
                <button
                  type="button"
                  title="Emoji"
                  className="emoji-button"
                  ref={emojiBtnRef}
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
                  {emojiIcon ? <img src={emojiIcon} alt="" /> : '😊'}
                </button>

                <button type="submit" className="dm__send">
                  Send
                </button>
              </div>
            </form>

            {/* Emoji picker portal */}
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
                  insertEmojiAtCaret(emojiData.emoji)
                }}
              />
            </EmojiPortal>
          </>
        ) : (
          <div className="dm__pane dm__pane--placeholder">
            <div className="dm__empty">
              <div className="dm__empty-icon">💬</div>
              <div className="dm__empty-title">Select a chat</div>
              <div className="dm__empty-sub">Choose a conversation to get started.</div>
            </div>
          </div>
        )}
      </main>
    </section>
  )
}
