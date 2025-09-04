import { useState, useRef } from 'react'
import { uploadService } from '../services/upload.service'

export function ImgUploader({ onUploaded }) {
  const [imgData, setImgData] = useState({
    imgUrl: null,
    height: 500,
    width: 500,
  })
  const [isUploading, setIsUploading] = useState(false)

  const fileInputRef = useRef(null)

  async function uploadImg(ev) {
    setIsUploading(true)
    const { secure_url, height, width } = await uploadService.uploadImg(ev)
    setImgData({ imgUrl: secure_url, width, height })
    setIsUploading(false)
    onUploaded && onUploaded(secure_url)
  }

  function getUploadLabel() {
    if (imgData.imgUrl) return 'Upload Another?'
    return isUploading ? 'Uploading…' : 'Select from computer'
  }

  function openFileDialog() {
    fileInputRef.current?.click()
  }

  return (
    <div className="upload-preview">
      {imgData.imgUrl && (
        <img
          src={imgData.imgUrl}
          style={{ maxWidth: '500px', float: 'right' }}
          alt="Preview"
        />
      )}

      <button
        type="button"
        className="select-button"
        onClick={openFileDialog}
        disabled={isUploading}
      >
        {getUploadLabel()}
      </button>

      {/* hidden input */}
      <input
        ref={fileInputRef}
        type="file"
        onChange={uploadImg}
        accept="image/*"
        style={{ display: 'none' }} // hides the native file input
      />
    </div>
  )
}
