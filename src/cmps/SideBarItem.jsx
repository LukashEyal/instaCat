import { useLocation } from 'react-router'
import { Link } from 'react-router-dom'
import { ReactSVG } from 'react-svg'

export function SideBarItem({
  icon,
  path,
  activePath,
  linkTo,
  onClick,
  isActive: isActiveProp,
  badgeCount, // <-- NEW
}) {
  const location = useLocation()
  const routeActive = linkTo ? location.pathname === linkTo : false
  const isActive = typeof isActiveProp === 'boolean' ? isActiveProp : routeActive
  const svgSrc = isActive && activePath ? activePath : path

  const content = (
    <>
      <div className="sidebar-item-icon-wrap">
        <ReactSVG src={svgSrc} />
        {!!badgeCount && (
          <span className="sidebar-badge" aria-label={`${badgeCount} unread`}>
            {badgeCount > 99 ? '99+' : badgeCount}
          </span>
        )}
      </div>
      <div className="sidebar-item-name">
        <span>{icon}</span>
      </div>
    </>
  )

  if (onClick) {
    return (
      <div
        className={`sidebar-item ${isActive ? 'active' : ''}`}
        onClick={onClick}
        role="button"
        tabIndex={0}
        onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && onClick(e)}
      >
        {content}
      </div>
    )
  }
  if (!linkTo) {
    return <div className={`sidebar-item ${isActive ? 'active' : ''}`}>{content}</div>
  }

  return (
    <Link
      to={linkTo}
      className={`sidebar-item ${isActive ? 'active' : ''}`}
      aria-current={isActive ? 'page' : undefined}
    >
      {content}
    </Link>
  )
}
