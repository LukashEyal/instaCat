// CreateCmp.jsx
import { useState } from "react"
import { AddImage } from "./post/AddImage"
import { ImageCrop } from "./post/ImageCorp" // your file name
import { AddPost } from "./post/AddPost"
import { uploadService } from "../services/upload.service.js"
import { AddPostAction } from "../store/posts.actions.js"

export function CreateCmp({ onClose, loggedInUser }) {
	const [step, setStep] = useState("select") // 'select' | 'crop' | 'compose'
	const [imgUrl, setImgUrl] = useState(null) // original uploaded image url
	const [cropResult, setCropResult] = useState(null) // { blob, url, meta }
	const [PostImageUrl, setPostImageUrl] = useState()
	const [content, setContent] = useState(null)
	const [location, setLocation] = useState(null)
	const [postObj, setPostObj] = useState(null)
	const [user, setUser] = useState(loggedInUser)
	
	const userId = user._id
	console.log("Logged in user", loggedInUser)
	console.log("User id :", userId)

	console.log("user: , " , user)
	const handleUploaded = url => {
		setImgUrl(url)
		setStep("crop")
	}

	const handleCropped = (blob, url, meta) => {
		setCropResult({ blob, url, meta })
		// keep imgUrl so Back from compose returns to crop
		setStep("compose")
	}

	const handleShare = async draft => {
		const {
			blob, // image Blob
			caption, // string
			location, // string
			collaborators, // string[]
			shareTo, // { facebook: boolean, ... }
			altText, // string
			settings, // { hideLikeCount, disableComments }
		} = draft

		const type = blob.type || "image/jpeg"
		const ext = type.split("/")[1] || "jpg"
		const file = new File([blob], `post_${Date.now()}.${ext}`, { type })

		// Your uploadService expects an <input type="file">-style event
		const fakeEvent = { target: { files: [file] } }
		const imgData = await uploadService.uploadImg(fakeEvent)

		setPostImageUrl(imgData.url)

		setStep("post")

		const postData = {
			comments: [],
			content: caption,
			createdAt: Date.now(),
			likeBy: [],
			location: location,
			imageUrl: imgUrl,
			
			userId: userId
		}

		AddPostAction(postData)

		onClose()
	}

	return (
		<div className="modal-overlay" onClick={onClose}>
			<div
				className={`create-post-main-container ${
					step === "compose" ? "wide" : ""
				}`}
				onClick={e => e.stopPropagation()}
			>
				{step === "select" && <AddImage onUploaded={handleUploaded} />}

				{step === "crop" && imgUrl && (
					<ImageCrop
						imgUrl={imgUrl}
						onBack={() => setStep("select")}
						onConfirm={handleCropped}
					/>
				)}

				{step === "compose" && cropResult?.blob && (
					<AddPost
						imageBlob={cropResult.blob}
						onBack={() => setStep("crop")}
						onShare={handleShare}
						userAvatar={user.avatarUrl}
						UserFullName={user.username}
					/>
				)}

				{step === "post" && PostImageUrl && AddPostAction(postData)}
			</div>
		</div>
	)
}
