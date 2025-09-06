// CreateCmp.jsx
import { useState } from "react";
import { AddImage } from "./post/AddImage";
import { ImageCrop } from "./post/ImageCorp"; // your file name
import { AddPost } from "./post/AddPost";

export function CreateCmp({ onClose, loggedInUser }) {
  const [step, setStep] = useState("select"); // 'select' | 'crop' | 'compose'
  const [imgUrl, setImgUrl] = useState(null); // original uploaded image url
  const [cropResult, setCropResult] = useState(null); // { blob, url, meta }


  const { avatarUrl, _id: userId, userFullname} = loggedInUser
  

  const handleUploaded = (url) => {
    setImgUrl(url);
    setStep("crop");
  };

  const handleCropped = (blob, url, meta) => {
    console.log("Cropped:", { blob, url, meta });
    setCropResult({ blob, url, meta });
    // keep imgUrl so Back from compose returns to crop
    setStep("compose");
  };

  const handleShare = async ({ blob, caption }) => {
    // TODO: upload `blob` + `caption` to your server here
    console.log("Share payload:", { blob, caption });
    onClose(); // or reset to start over
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
     <div className={`create-post-main-container ${step === 'compose' ? 'wide' : ''}`} onClick={(e) => e.stopPropagation()}>

        {step === "select" && (
          <AddImage onUploaded={handleUploaded} />
        )}

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
            userAvatar={avatarUrl}
            UserFullName={userFullname}
          />
        )}
      </div>
    </div>
  );
}
