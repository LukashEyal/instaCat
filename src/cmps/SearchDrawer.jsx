import { useEffect } from 'react'

export function SearchDrawer({ onClose }) {
  useEffect(() => {
    console.log('Search drawer opened')
  }, [])

  return (
    <div className="search-drawer">
      <button className="close-drawer" onClick={onClose}>Close</button>
      <p>Search drawer is open.</p>
    </div>
  )
} 