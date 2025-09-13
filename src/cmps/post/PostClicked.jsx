import React, { useState } from "react"
import { formatDistanceToNow } from "date-fns"

import { toggleLike } from "../../store/posts.actions.js"

import bookmark from "../../assets/svgs/post-container/bookmark.svg"
import comment from "../../assets/svgs/post-container/comment.svg"
import emoji from "../../assets/svgs/post-container/emoji.svg"
import like from "../../assets/svgs/post-container/like.svg"
import unlike from "../../assets/svgs/post-container/unlike.svg"
import option from "../../assets/svgs/post-container/option.svg"
import share from "../../assets/svgs/post-container/share.svg"

import { PostButton } from "./PostButton.jsx"
import { LikeBy } from "./LikeBy.jsx"
import { Comments } from "./Comments.jsx"

export function PostClicked({ post, user, users, postOwner }) {
	const [showModal, setShowModal] = useState(false)
	const [selectedComments, setSelectedComments] = useState(null)
	
	


	

	const postAuthor = postOwner

	
	const comments = post.comments

	function onToggleLike(postId, userId) {
		toggleLike(postId, userId)
	}

	return (
		<div className="post">
			<div className="post-header">
				<img
					src={postAuthor?.avatarUrl}
					alt={`${postAuthor?.username}'s avatar`}
				/>
				<div className="post-user-details">
					<div className="post-user-meta">
						<span className="post-user-name">
							{postAuthor?.username}
						</span>
						<span className="post-created-at">
							•{" "}
							{formatDistanceToNow(new Date(post.createAt), {
								addSuffix: true,
							})}
						</span>
					</div>
					<div className="post-location">{post.location}</div>
				</div>
				<button className="post-options">
					<PostButton path={option} />
				</button>
			</div>
			<div className="post-image">
				<img src={post.imageUrl || post.imgUrl} alt="post" />
			</div>
			<div className="user-post">
				<div className="user-post-header">
					<div className="avatar">
						<img
							src={postAuthor?.avatarUrl}
							alt={`${postAuthor?.username}'s avatar`}
						/>
					</div>
					<span className="user-name">{postAuthor?.username}</span>
				</div>
			</div>
			<span className="user-post-content">{post.content}</span>

			<div className="post-comments">
				<Comments comments={comments} users={users} />
			</div>

			<div className="actions">
				<div className="post-actions">
					<button className="like-button">
						<PostButton
							onClick={() => onToggleLike(post._id, user._id)}
							path={
								post.likeBy.includes(user._id) ? unlike : like
							}
							className={
								post.likeBy.includes(user._id)
									? "unlike-icon"
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
					<button className="bookmark-button">
						<PostButton path={bookmark} />
					</button>
				</div>

				<div className="post-likes">
					<LikeBy likeIds={post.likeBy} currentUser={user} />
				</div>

				<div className="post-comment">
					<input
						type="text"
						className="comment-input"
						placeholder="Add a comment..."
						onFocus={() => {
							setSelectedComments(post) // or whichever post data you want to pass
							setShowModal(true)
						}}
					/>
					<button className="emoji-button">
						<PostButton path={emoji} />
					</button>
				</div>

				<hr />

				{showModal && selectedComments && (
					<Comments
						comments={comments}
						onClose={() => setShowModal(false)}
						user={user}
						users={users}
					/>
				)}
			</div>
		</div>
	)
}

export default PostClicked
