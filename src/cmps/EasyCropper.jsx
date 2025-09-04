import { useState, useCallback } from 'react'
import Cropper from 'react-easy-crop'
import { getCroppedImg } from '../services/crop.utils'

const ASPECTS = {
  square: 1 / 1,       // 1:1
  portrait: 4 / 5,     // 4:5 (IG portrait)
  landscape: 1.91 / 1, // 1.91:1 (IG landscape)
}

export function EasyCropper({ src, onCancel, onDone }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [aspect, setAspect] = useState(ASPECTS.square)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)

  const onCropComplete = useCallback((_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels)
  }, [])

  const handleDone = useCallback(async () => {
    if (!croppedAreaPixels) return
    const { blob, blobUrl } = await getCroppedImg(src, croppedAreaPixels)
    onDone?.({ blob, blobUrl, aspect })
  }, [croppedAreaPixels, src, aspect, onDone])

  return (
    <div className="ig-cropper">
      <div className="ig-cropper-stage">
        <Cropper
          image={src}
          crop={crop}
          zoom={zoom}
          aspect={aspect}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={onCropComplete}
          restrictPosition={true}
          zoomWithScroll={true}
          showGrid={false}
        />
      </div>

      <div className="ig-controls">
        <div className="ig-aspects">
          <button className={`pill ${aspect===ASPECTS.square?'active':''}`} onClick={() => setAspect(ASPECTS.square)}>1:1</button>
          <button className={`pill ${aspect===ASPECTS.portrait?'active':''}`} onClick={() => setAspect(ASPECTS.portrait)}>4:5</button>
          <button className={`pill ${aspect===ASPECTS.landscape?'active':''}`} onClick={() => setAspect(ASPECTS.landscape)}>1.91:1</button>
        </div>

        <div className="ig-zoom">
          <label>Zoom</label>
          <input
            type="range"
            min={1}
            max={3}
            step={0.01}
            value={zoom}
            onChange={(e) => setZoom(+e.target.value)}
          />
        </div>

        <div className="ig-actions">
          <button className="select-button" onClick={onCancel}>Cancel</button>
          <button className="select-button" onClick={handleDone}>Next</button>
        </div>
      </div>
    </div>
  )
}
