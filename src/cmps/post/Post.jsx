import { formatDistanceToNow } from "date-fns"
import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { toggleLike } from "../../store/posts.actions.js"
import { getUser } from "../../store/user.actions.js"

import bookmark from "../../assets/svgs/post-container/bookmark.svg"
import comment from "../../assets/svgs/post-container/comment.svg"
import emoji from "../../assets/svgs/post-container/emoji.svg"
import like from "../../assets/svgs/post-container/like.svg"
import unlike from "../../assets/svgs/post-container/unlike.svg"
import option from "../../assets/svgs/post-container/option.svg"
import share from "../../assets/svgs/post-container/share.svg"
import verfied from "../../assets/svgs/post-container/verified.svg"
import avatarPlaceHolder from "../../assets/svgs/post-container/avatar-placeholder.svg"
import { Comments } from "./PostModal.jsx"
import { PostButton } from "./PostButton.jsx"
import { LikeBy } from "./LikeBy.jsx"
import { CommentBy } from "./CommentBy.jsx"
import { getShortTimeAgo } from "./GetTime.js"
import { AddComment } from "./AddComment.jsx"

export function Post({ post, user }) {
	const [showModal, setShowModal] = useState(false)
	const [selectedComments, setSelectedComments] = useState(null)
	const [postUser, setPostUser] = useState(null)

	const postId = post._id
	const postAuthorId = post.userId
	const comments = post.comments

	const DEFAULT_AVATAR = avatarPlaceHolder

	useEffect(() => {
		let ignore = false
		async function loadUser() {
			try {
				const userObj = await getUser(postAuthorId)
				if (!ignore) setPostUser(userObj || null)
			} catch (err) {
				console.error("Failed to fetch post author:", err)
				if (!ignore) setPostUser(null)
			}
		}
		loadUser()
		return () => {
			ignore = true
		}
	}, [postAuthorId])

	function onToggleLike(postId, userId) {
		toggleLike(postId, userId)
	}

	// Optional: block render until author is loaded
	if (!postUser) {
		return (
			<div className="post">
				{/* simple skeleton / fallback */}
				<div className="post-header">
					<img src={DEFAULT_AVATAR} alt="user's avatar" />
					<div className="post-user-details">
						<div className="post-user-meta">
							<span className="post-user-name">Loading…</span>
							<span className="post-created-at">
								• {getShortTimeAgo(post.createdAt)}
							</span>
						</div>
					</div>
				</div>
			</div>
		)
	}

	return (
		<div className="post">
			<div className="post-header">
				<img
					src={postUser?.avatarUrl || DEFAULT_AVATAR}
					alt={`${postUser?.username || "user"}'s avatar`}
				/>

				<div className="post-user-details">
					<div className="post-user-meta">
						<span className="post-user-name">
							{postUser?.username || "Unknown"}
						</span>
						<PostButton path={verfied} />
						<span className="post-created-at">
							• {getShortTimeAgo(post.createdAt)}
						</span>
					</div>
					<div className="post-location">{post.location}</div>
				</div>

				<button className="post-options">
					<PostButton path={option} />
				</button>
			</div>

			<div className="post-content">
				<div className="post-image">
					<img src={post.imageUrl || post.imgUrl} alt="post" />
				</div>

				<div className="post-actions">
					<div className="left-actions">
						<button className="like-button">
							<PostButton
								onClick={() => onToggleLike(post._id, user._id)}
								path={
									post.likeBy.includes(user._id)
										? unlike
										: like
								}
								className={
									post.likeBy.includes(user._id)
										? "unlike"
										: ""
								}
							/>
						</button>
						<button className="comment-button">
							<PostButton path={comment} />
						</button>
						<button className="share-button">
							<PostButton path={share} />
						</button>
					</div>
					<button className="bookmark-button">
						<PostButton path={bookmark} />
					</button>
				</div>

				<div className="post-likes">
					<LikeBy likeIds={post.likeBy} currentUser={user} />
				</div>

				<div className="post-caption">
					<span className="caption-user">
						<strong>{postUser?.username || "Unknown"}</strong>
						<PostButton path={verfied} />
					</span>
					{` ${post.content}`}
				</div>

				<div className="post-comments">
					<CommentBy
						comments={comments}
						currentUser={user}
						onClick={() => {
							setSelectedComments(post)
							setShowModal(true)
						}}
					/>
				</div>

				<div className="post-comment">
					<AddComment postId={postId} userId={user._id} />
					<button className="emoji-button">
						<PostButton path={emoji} />
					</button>
				</div>
			</div>

			{showModal && selectedComments && (
				<Comments
					post={post}
					onClose={() => setShowModal(false)}
					user={user}
				/>
			)}
		</div>
	)
}

export default Post
