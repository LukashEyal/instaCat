import React, { useRef, useEffect, useState } from "react"
import PostButton from "./Post"
import { formatDistanceToNow } from "date-fns"
import {
	toggleLike,
	getFullNamesFromUserIds,
	getUserNames,
} from "../../store/posts.actions"

import PostClicked from "./PostClicked"

export function Comments({ post, onClose, user, users, postUserObj }) {

	
	const modalRef = useRef()

	const handleClickOutside = e => {
		if (modalRef.current && !modalRef.current.contains(e.target)) {
			onClose()
		}
	}

	useEffect(() => {
		document.addEventListener("mousedown", handleClickOutside)
		return () =>
			document.removeEventListener("mousedown", handleClickOutside)
	}, [])




	return (
		<div className="modal-overlay">
			<div className="modal-content" ref={modalRef}>
				<PostClicked post={post} user={user} users={users} postOwner={postUserObj} />
			</div>
		</div>
	)
}
