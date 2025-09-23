import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { sendMsg } from '../../store/msg.actions'
import { useDispatch } from 'react-redux'
import { socketService, SOCKET_EMIT_SEND_MSG } from '../../services/socket.service'

export function SendMessageModal({ toUser, fromUserId, onSend, onClose }) {
  const [text, setText] = useState('')
  const cardRef = useRef(null)
  const inputRef = useRef(null)
  const [sending, setSending] = useState(false)

  // ESC close, autofocus, lock scroll
  useEffect(() => {
    const onKey = e => e.key === 'Escape' && onClose?.()
    window.addEventListener('keydown', onKey)
    const t = setTimeout(() => inputRef.current?.focus(), 0)

    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      clearTimeout(t)
      document.body.style.overflow = overflow
    }
  }, [onClose])

  const onBackdropClick = e => {
    if (e.target === e.currentTarget) onClose?.()
  }

  const handleKeyDown = e => {
    // Enter to send, Shift+Enter for newline
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleSend = async () => {
    const txt = text.trim()
    if (!txt || sending) return
    try {
      setSending(true)
      const newMsg = await sendMsg({
        toUserId: toUser._id,
        fromUserId,
        txt,
      })
      socketService.emit(SOCKET_EMIT_SEND_MSG, newMsg)
      setText('')
      onClose?.()
    } catch (err) {
      console.error('Failed to send message:', err)
      // optionally show a toast
    } finally {
      setSending(false)
    }
  }

  return createPortal(
    <div className="msg-backdrop" onMouseDown={onBackdropClick} role="dialog" aria-modal="true">
      <div
        className="msg-card"
        ref={cardRef}
        onMouseDown={e => e.stopPropagation()}
        role="document"
      >
        <header className="msg-header">
          <div className="msg-recipient">
            <img
              className="msg-avatar"
              src={toUser?.avatarUrl || '/assets/avatar-placeholder.svg'}
              alt={(toUser?.username || 'User') + ' avatar'}
            />
            <div className="msg-recipient-meta">
              <div className="msg-recipient-name">{toUser?.username || 'Unknown user'}</div>
              {toUser?.fullName && <div className="msg-recipient-sub">{toUser.fullName}</div>}
            </div>
          </div>
          <button className="msg-close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </header>

        <div className="msg-body">
          <textarea
            ref={inputRef}
            className="msg-input"
            placeholder={`Write a message to ${toUser?.username || 'user'}…`}
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={4}
          />
        </div>

        <footer className="msg-actions">
          <div className="msg-hint">Press Enter to send • Shift+Enter for a new line</div>
          <button className="msg-send" onClick={handleSend} disabled={!text.trim() || sending}>
            {sending ? 'Sending…' : 'Send'}
          </button>
        </footer>
      </div>
    </div>,
    document.body
  )
}
