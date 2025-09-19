import { useEffect } from 'react'
import { LoginForm } from '../cmps/LoginForm'
import { ReactSVG } from 'react-svg'
import { login } from '../store/user.actions'
import logo from '../assets/svgs/instacat-logo.svg'

export function SwitchUserModal({ onClose }) {
  const handleLogin = async ({ username, password }) => {
    try {
      await login({ username, password })
      onClose?.()
    } catch (err) {
      console.error('Login failed', err)
    }
  }

  // Close on ESC
  useEffect(() => {
    const onKey = e => e.key === 'Escape' && onClose?.()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="switch-user-modal__overlay" onClick={onClose} role="dialog" aria-modal="true">
      <section
        className="switch-user-modal__content signin__card"
        onClick={e => e.stopPropagation()}
      >
        <button className="switch-user-modal__close" onClick={onClose} aria-label="Close modal">
          ✖
        </button>

        <ReactSVG className="signin__logo" src={logo} />
        <LoginForm onSubmit={handleLogin} />
      </section>
    </div>
  )
}
