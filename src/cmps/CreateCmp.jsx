import { useState } from "react"
import drag from "../../src/assets/svgs/drag.svg"
import { ImgUploader } from "./ImgUploader"
import { EasyCropper } from "./EasyCropper"

function PostComposer({ mediaUrl, onClose, onConfirm }) {
  const [cropped, setCropped] = useState(null)

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="create-post-main-container" onClick={(e) => e.stopPropagation()}>
        <div className="create-post-header">Crop</div>

        <div className="create-post-body" style={{ display: "grid", gap: 16 }}>
          {!cropped ? (
            <EasyCropper
              src={mediaUrl}
              onCancel={onClose}
              onDone={({ blob, blobUrl }) => setCropped({ blob, blobUrl })}
            />
          ) : (
            <>
              <img src={cropped.blobUrl} alt="Cropped" style={{ maxWidth: 420, borderRadius: 12, alignSelf: 'center' }} />
              <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
                <button className="select-button" onClick={() => setCropped(null)}>Re-crop</button>
                <button className="select-button" onClick={() => onConfirm?.(cropped)}>Use this</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export function CreateCmp({ onClose }) {
  const [mediaUrl, setMediaUrl] = useState(null)
  const [finalMedia, setFinalMedia] = useState(null)

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="create-post-main-container" onClick={(e) => e.stopPropagation()}>
        <div className="create-post-header">Create new post</div>

        <div className="create-post-body">
          {finalMedia ? (
            <div style={{ display: "grid", gap: 16, justifyItems: "center" }}>
              <img src={finalMedia.blobUrl} alt="final" style={{ maxWidth: 420, borderRadius: 12 }} />
              {/* Continue to caption/tags/etc. */}
              <button className="select-button" onClick={() => { setFinalMedia(null); setMediaUrl(null) }}>
                Start over
              </button>
            </div>
          ) : mediaUrl ? (
            <PostComposer
              mediaUrl={mediaUrl}
              onClose={onClose}
              onConfirm={(cropped) => setFinalMedia(cropped)}
            />
          ) : (
            <div className="drag-container">
              <img src={drag} alt="Drag icon" className="drag-icon" />
              <p>Drag Photos and videos here</p>
              <ImgUploader onUploaded={setMediaUrl} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
