import { useEffect, useRef, useState } from "react"

export function SearchDrawer({ onClose }) {
  const [q, setQ] = useState("")
  const inputRef = useRef(null)

  useEffect(() => {
    const onEsc = (e) => e.key === "Escape" && onClose?.()
    window.addEventListener("keydown", onEsc)
    return () => window.removeEventListener("keydown", onEsc)
  }, [onClose])

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  return (
    <>
      {/* click-out overlay */}
      <div className="drawer-overlay" onClick={onClose} />

      {/* panel */}
      <aside
        className="drawer search-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Search"
      >
        <header className="drawer-header">
          <h2>Search</h2>
          <button className="icon-btn" onClick={onClose} aria-label="Close search">✕</button>
        </header>

        <div className="search-box">
          <input
            ref={inputRef}
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search"
            aria-label="Search input"
          />
        </div>

        <section className="drawer-content">
          <div className="search-empty-state">
            <div className="title">No recent searches</div>
            <div className="subtitle">Try searching for people, tags, or places.</div>
          </div>

          {/* Example of search results list (replace with your data): */}
          {/* <ul className="search-results">
            <li className="search-item">Result 1</li>
            <li className="search-item">Result 2</li>
          </ul> */}
        </section>
      </aside>
    </>
  )
}
