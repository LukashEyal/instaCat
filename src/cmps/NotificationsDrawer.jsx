import { useEffect } from "react"

export function NotificationsDrawer({ onClose }) {
  useEffect(() => {
    const onEsc = (e) => e.key === "Escape" && onClose?.()
    window.addEventListener("keydown", onEsc)
    return () => window.removeEventListener("keydown", onEsc)
  }, [onClose])

  return (
    <>
      {/* click-out overlay */}
      <div className="drawer-overlay" onClick={onClose} />

      {/* panel */}
      <aside
        className="drawer notifications-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Notifications"
      >
        <header className="drawer-header">
          <h2>Notifications</h2>
          <button className="icon-btn" onClick={onClose} aria-label="Close notifications">✕</button>
        </header>

        <section className="drawer-content">
          {/* Replace with your real notifications feed */}
          <ul className="notif-list">
            <li className="notif-item">
              <div className="notif-title"><strong>eyal</strong> liked your post</div>
              <div className="notif-time">2m ago</div>
            </li>
            <li className="notif-item">
              <div className="notif-title"><strong>noa</strong> started following you</div>
              <div className="notif-time">15m ago</div>
            </li>
            <li className="notif-item">
              <div className="notif-title"><strong>mika</strong> commented: “🔥”</div>
              <div className="notif-time">1h ago</div>
            </li>
          </ul>
        </section>
      </aside>
    </>
  )
}
