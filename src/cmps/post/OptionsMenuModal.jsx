import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

export function OptionsMenuModal({ onClose, onSendMessage }) {
  const dialogRef = useRef(null)

  useEffect(() => {
    const onKey = e => e.key === 'Escape' && onClose?.()
    window.addEventListener('keydown', onKey)

    const t = setTimeout(() => {
      const first = dialogRef.current?.querySelector(
        'button, [href], [tabindex]:not([tabindex="-1"])'
      )
      first?.focus()
    }, 0)

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

  return createPortal(
    <div className="opt-backdrop" onMouseDown={onBackdropClick} role="dialog" aria-modal="true">
      <div
        className="opt-card"
        ref={dialogRef}
        onMouseDown={e => e.stopPropagation()}
        role="document"
      >
        <button className="opt-row" onClick={onSendMessage}>
          Send Message
        </button>
        <button className="opt-row cancel" onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>,
    document.body
  )
}
