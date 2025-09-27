// ExplorePost.jsx

import { ReactSVG } from 'react-svg'
import unlikeExplore from '../assets/svgs/post-container/unlike-explore.svg'
import comment from '../assets/svgs/post-container/comment.svg'
import commentExplore from '../assets/svgs/post-container/comment-explore-post.svg'

export function ExplorePost({ post, onOpen }) {
	return (
		<div className="explore-post" onClick={onOpen}>
			<img
				src={post.imageUrl}
				alt="Explore Post"
				className="explore-post-image"
			/>
			<div className="explore-post-overlay">
				<div className="explore-likes">
					<ReactSVG src={unlikeExplore} />
					<span
						style={{
							marginTop: '-8px',
							fontSize: '16px',
							fontWeight: '700',
						}}
					>
						{post.likeBy.length ?? 0}
					</span>
				</div>
				<div className="explore-comments">
					<ReactSVG src={commentExplore} />
					<span
						style={{
							marginTop: '-8px',
							fontSize: '16px',
							fontWeight: '700',
						}}
					>
						{post.comments.length ?? 0}
					</span>
				</div>
			</div>
		</div>
	)
}
