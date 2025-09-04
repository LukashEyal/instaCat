export function CreateCmp({ onClose }) {
	return (
		<div className="modal-overlay" onClick={onClose}>
			<div
				className="create-post-main-container"
				onClick={e => e.stopPropagation()}
			>
				<div className="create-post-header">Create new post</div>
				<div className="create-post-body">
					{/* Your content goes here */}
				</div>
			</div>
		</div>
	)
}
