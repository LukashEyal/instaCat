import { useState } from "react";
import { AddImage } from "./post/AddImage";
import { ImageCrop } from "./post/ImageCorp"; // your file name

export function CreateCmp({ onClose }) {
  const [imgUrl, setImgUrl] = useState(null);
  const [croppedUrl, setCroppedUrl] = useState(null);

  const handleUploaded = (url) => setImgUrl(url);

  const handleCropped = (blob, url, meta) => {
    console.log("Cropped:", { blob, url, meta });
    setCroppedUrl(url);        // preview or pass downstream
    // TODO: upload `blob` to server or move to next step of your flow
    // Example: close cropper and show preview
    setImgUrl(null);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="create-post-main-container" onClick={(e) => e.stopPropagation()}>
        {!imgUrl ? (
          <>
            <AddImage onUploaded={handleUploaded} />
            {croppedUrl && <img src={croppedUrl} alt="Cropped preview" style={{maxWidth: 200}} />}
          </>
        ) : (
          <ImageCrop
            imgUrl={imgUrl}
            onBack={() => setImgUrl(null)}
            onConfirm={handleCropped}
          />
        )}
      </div>
    </div>
  );
}
