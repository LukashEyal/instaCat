import { ReactSVG } from 'react-svg'

export function SideBarItemMore({ icon, path, onClick, isActive }) {
	const svgSrc = path

	const content = (
		<>
			<ReactSVG src={svgSrc} />
			<div className="sidebar-item-name">
				<span>{icon}</span>
			</div>
		</>
	)

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
