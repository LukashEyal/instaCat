import { useRef, useState } from 'react'
import Cropper from 'react-easy-crop'

import zoomIcon from '../../assets/svgs/post-container/zoom.svg'
import aspectsIcon from '../../assets/svgs/post-container/aspects.svg'
import backIcon from '../../assets/svgs/post-container/back.svg'
import addImageIcon from '../../assets/svgs/post-container/addImage.svg'

const ASPECTS = [
  { label: '1:1', value: 1 },
  { label: '4:5', value: 4 / 5 },
  { label: '16:9', value: 16 / 9 },
]
const ZOOM_PRESETS = [1, 1.25, 1.5, 2, 2.5, 3]

// util: load image
const createImage = src =>
  new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous' // avoid canvas tainting for same-origin/allowed CORS
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })

// util: crop to canvas -> Blob + URL
async function getCroppedImg(imageSrc, pixelCrop) {
  const img = await createImage(imageSrc)
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  canvas.width = Math.max(1, Math.round(pixelCrop.width))
  canvas.height = Math.max(1, Math.round(pixelCrop.height))

  // draw the cropped area of the source image to (0,0) on the canvas
  ctx.drawImage(
    img,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    canvas.width,
    canvas.height
  )

  // return both blob and object URL
  const blob = await new Promise(res => canvas.toBlob(b => res(b), 'image/jpeg', 0.92))
  const url = URL.createObjectURL(blob)
  return { blob, url, width: canvas.width, height: canvas.height }
}

export function ImageCrop({ imgUrl, onBack, onConfirm, onAddImage }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [aspectIdx, setAspectIdx] = useState(0)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
  const [busy, setBusy] = useState(false)

  const fileInputRef = useRef(null)

  const onCropComplete = (_area, areaPx) => {
    setCroppedAreaPixels(areaPx)
  }

  const cycleAspect = () => setAspectIdx(idx => (idx + 1) % ASPECTS.length)

  const cycleZoom = (dir = 1) => {
    const i = ZOOM_PRESETS.findIndex(z => z >= zoom - 1e-6)
    const next = i === -1 ? 0 : (i + dir + ZOOM_PRESETS.length) % ZOOM_PRESETS.length
    setZoom(ZOOM_PRESETS[next])
  }

  const handleAddImageClick = () => fileInputRef.current?.click()
  const handleFileChange = e => {
    const file = e.target.files?.[0]
    if (!file) return
    onAddImage?.(file)
    e.target.value = ''
  }

  const handleNext = async () => {
    if (!croppedAreaPixels) return // safety
    try {
      setBusy(true)
      const result = await getCroppedImg(imgUrl, croppedAreaPixels)
      // notify parent: (blob, url, meta)
      onConfirm?.(result.blob, result.url, {
        width: result.width,
        height: result.height,
        aspect: ASPECTS[aspectIdx].label,
        zoom,
        crop,
      })
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <div className="create-post-header crop-header">
        <div className="header-left">
          <button className="back-btn" onClick={onBack} aria-label="Back">
            <img src={backIcon} alt="" />
          </button>
        </div>
        <div className="header-title">Crop</div>
        <div className="header-right">
          <button className="next-btn" onClick={handleNext} disabled={busy || !croppedAreaPixels}>
            {busy ? 'Processing…' : 'Next'}
          </button>
        </div>
      </div>

      <div className="create-post-body crop-body">
        <div className="cropper-wrap">
          <div className="cropper-frame">
            <Cropper
              image={imgUrl}
              crop={crop}
              zoom={zoom}
              aspect={ASPECTS[aspectIdx].value}
              objectFit="contain"
              showGrid
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
            />
          </div>
        </div>

        {/* Toolbar: left group (aspect+zoom), right: add image */}
        <div className="cropper-toolbar bl">
          <button
            className="icon-btn"
            title={`Aspect ${ASPECTS[aspectIdx].label}`}
            onClick={cycleAspect}
            aria-label="Change aspect ratio"
          >
            <img src={aspectsIcon} alt="" />
          </button>

          <button
            className="icon-btn"
            title={`Zoom ${zoom.toFixed(2)}x (click to cycle)`}
            onClick={() => cycleZoom(+1)}
            onContextMenu={e => {
              e.preventDefault()
              cycleZoom(-1)
            }}
            aria-label="Change zoom"
          >
            <img src={zoomIcon} alt="" />
          </button>

          <button
            className="icon-btn push-right"
            title="Add image"
            onClick={handleAddImageClick}
            aria-label="Add image"
          >
            <img src={addImageIcon} alt="" />
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
        </div>
      </div>
    </>
  )
}
