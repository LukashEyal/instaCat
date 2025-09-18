import { useState, useEffect, useRef } from 'react'
import { toggleLikeOptimistic } from '../../store/posts.actions.js'
import { getUser } from '../../store/user.actions.js'
import EmojiPicker from 'emoji-picker-react'
import { createPortal } from 'react-dom'
import { Comments } from './PostModal.jsx'
import { PostButton } from './PostButton.jsx'
import { LikeBy } from './LikeBy.jsx'
import { CommentBy } from './CommentBy.jsx'
import { getShortTimeAgo } from './GetTime.js'
import { AddComment } from './AddComment.jsx'

import bookmark from '../../assets/svgs/post-container/bookmark.svg'
import comment from '../../assets/svgs/post-container/comment.svg'
import emoji from '../../assets/svgs/post-container/emoji.svg'
import like from '../../assets/svgs/post-container/like.svg'
import unlike from '../../assets/svgs/post-container/unlike.svg'
import option from '../../assets/svgs/post-container/option.svg'
import share from '../../assets/svgs/post-container/share.svg'
import verfied from '../../assets/svgs/post-container/verified.svg'
import avatarPlaceHolder from '../../assets/svgs/post-container/avatar-placeholder.svg'

export function Post({ post, user, postUser }) {
	const [showModal, setShowModal] = useState(false)
	const [selectedComments, setSelectedComments] = useState(null)

	const postId = post._id
	const comments = post.comments

	const DEFAULT_AVATAR = avatarPlaceHolder

	// --- Emoji picker + controlled comment input ---
	const [ShowPicker, setShowPicker] = useState(false)
	const [pickerPos, setPickerPos] = useState({ top: 64, left: 0 })
	const emojiBtnRef = useRef(null)
	const emojiPopRef = useRef(null)

	// Controlled input for AddComment (so we can inject emojis)
	const [commentText, setCommentText] = useState('')
	const inputRef = useRef(null)

	function EmojiPortal({ open, onClose, children, style, popRef }) {
		if (!open) return null
		return createPortal(
			<div
				className="emoji-backdrop"
				onMouseDown={onClose}
				role="dialog"
				aria-modal="true"
			>
				<div
					className="emoji-sheet"
					ref={popRef}
					style={style}
					onMouseDown={e => e.stopPropagation()}
				>
					{children}
				</div>
			</div>,
			document.body
		)
	}

	useEffect(() => {
		if (!ShowPicker) return

		const onDocMouseDown = e => {
			const pop = emojiPopRef.current
			const btn = emojiBtnRef.current
			if (!pop || !btn) return

			const clickedInsidePop = pop.contains(e.target)
			const clickedButton = btn.contains(e.target)

			if (!clickedInsidePop && !clickedButton) {
				setShowPicker(false)
			}
		}

		document.addEventListener('mousedown', onDocMouseDown)
		return () => document.removeEventListener('mousedown', onDocMouseDown)
	}, [ShowPicker])

	function onToggleLike(postId, userId) {
		// toggleLike(postId, userId);
		toggleLikeOptimistic(postId, userId)
	}

	return (
		<div className="post">
			<div className="post-header">
				<img
					src={postUser?.avatarUrl || DEFAULT_AVATAR}
					alt={`${postUser?.username || 'user'}'s avatar`}
				/>

				<div className="post-user-details">
					<div className="post-user-meta">
						<span className="post-user-name">
							{postUser?.username || 'Unknown'}
						</span>
						<PostButton path={verfied} />
						<span className="post-created-at">
							• {getShortTimeAgo(post.createAt)}
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
										? 'unlike'
										: ''
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
					<LikeBy
						fromHomePage={true}
						likeIds={post.likeBy}
						currentUser={user}
						postId={post._id}
						userId={user._id}
					/>
				</div>

				<div className="post-caption">
					<span className="caption-user">
						<strong>{postUser?.username || 'Unknown'}</strong>
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
					{/* Controlled input */}
					<AddComment
						postId={postId}
						userId={user._id}
						text={commentText}
						onChange={setCommentText}
						inputRef={inputRef}
					/>

					<button
						type="button"
						className="emoji-button"
						ref={emojiBtnRef}
						onClick={() => {
							const r =
								emojiBtnRef.current.getBoundingClientRect()
							const PICKER_W = 320
							const PICKER_H = 380
							const GAP = 8

							const left = Math.min(
								Math.max(8, r.right - PICKER_W),
								window.innerWidth - PICKER_W - 8
							)
							const top = Math.max(8, r.top - PICKER_H - GAP)

							setPickerPos({ top, left })
							setShowPicker(v => !v)
						}}
						aria-expanded={ShowPicker}
						title="Add emoji"
					>
						<PostButton path={emoji} />
					</button>

					<EmojiPortal
						open={ShowPicker}
						onClose={() => setShowPicker(false)}
						style={{ top: pickerPos.top, left: pickerPos.left }}
						popRef={emojiPopRef}
					>
						<EmojiPicker
							emojiStyle="facebook"
							previewConfig={{ showPreview: false }}
							height={380}
							width={320}
							onEmojiClick={emojiData => {
								setCommentText(t => t + emojiData.emoji)
								requestAnimationFrame(() =>
									inputRef.current?.focus()
								)
								// If you want it to close after pick:
								// setShowPicker(false);
							}}
						/>
					</EmojiPortal>
				</div>
			</div>

			{showModal && selectedComments && (
				<Comments
					post={post}
					user={user}
					postUserObj={postUser}
					onClose={() => setShowModal(false)}
				/>
			)}
		</div>
	)
}

export default Post
