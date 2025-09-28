// CreateCmp.jsx
import { useState, useEffect } from 'react'
import { AddImage } from './post/AddImage'
import { ImageCrop } from './post/ImageCrop' // ← fix import name
import { AddPost } from './post/AddPost'
import { uploadService } from '../services/upload.service.js'
import { AddPostAction } from '../store/posts.actions.js'
import { useSelector } from 'react-redux'

export function CreateCmp({ onClose }) {
  const loggedInUser = useSelector(s => s.userModule.user)

  const [step, setStep] = useState('select') // 'select' | 'crop' | 'compose'
  const [imgUrl, setImgUrl] = useState(null) // original uploaded image url (for cropping UI)
  const [cropResult, setCropResult] = useState(null) // { blob, url, meta }
  const [postImageUrl, setPostImageUrl] = useState(null) // final uploaded (cropped) URL

  // cleanup preview URL to avoid leaks
  useEffect(() => {
    return () => {
      if (cropResult?.url) URL.revokeObjectURL(cropResult.url)
    }
  }, [cropResult?.url])

  const user = loggedInUser
  const userId = user._id

  function handleUploaded(url) {
    setImgUrl(url)
    setStep('crop')
  }

  function handleCropped(blob, url, meta) {
    setCropResult({ blob, url, meta })
    setStep('compose')
  }

  async function handleShare(draft) {
    // draft comes from <AddPost/> and should include the cropped blob & fields
    const {
      blob, // cropped image Blob
      caption, // string
      location, // string
      collaborators, // string[] (if you support)
      shareTo, // {facebook?: boolean, ...} (if you support)
      altText, // string (if you support)
      settings, // { hideLikeCount?, disableComments? } (if you support)
    } = draft

    // 1) Upload the CROPPED blob
    const type = blob?.type || 'image/jpeg'
    const ext = type.split('/')[1] || 'jpg'
    const file = new File([blob], `post_${Date.now()}.${ext}`, { type })

    // If uploadService expects an input-change-like event:
    const fakeEvent = { target: { files: [file] } }
    const imgData = await uploadService.uploadImg(fakeEvent) // expect { url: '...' }

    const finalUrl = imgData.url
    setPostImageUrl(finalUrl)

    // 2) Build the post using the uploaded (cropped) URL
    const postData = {
      comments: [],
      content: caption ?? '',
      createdAt: Date.now(),
      likeBy: [],
      location: location ?? '',
      imageUrl: finalUrl, // ← IMPORTANT: use cropped upload url
      userId,
    }

    // 3) Dispatch and close
    AddPostAction(postData)
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className={`create-post-main-container ${step === 'compose' ? 'wide' : ''}`}
        onClick={e => e.stopPropagation()}
      >
        {step === 'select' && <AddImage onUploaded={handleUploaded} />}

        {step === 'crop' && imgUrl && (
          <ImageCrop imgUrl={imgUrl} onBack={() => setStep('select')} onConfirm={handleCropped} />
        )}

        {step === 'compose' && cropResult?.blob && (
          <AddPost
            imageBlob={cropResult.blob} // ← CROPPED blob goes in
            imagePreviewUrl={cropResult.url} // optional: show preview
            onBack={() => setStep('crop')}
            onShare={handleShare}
            userAvatar={user.avatarUrl}
            UserFullName={user.username}
          />
        )}
        {/* removed the "post" step that tried to call AddPostAction in JSX */}
      </div>
    </div>
  )
}
