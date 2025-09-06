// CreateCmp.jsx
import { useState } from "react";
import { AddImage } from "./post/AddImage";
import { ImageCrop } from "./post/ImageCorp"; // your file name
import { AddPost } from "./post/AddPost";
import { uploadService } from "../services/upload.service.js";


export function CreateCmp({ onClose, loggedInUser }) {
  const [step, setStep] = useState("select"); // 'select' | 'crop' | 'compose'
  const [imgUrl, setImgUrl] = useState(null); // original uploaded image url
  const [cropResult, setCropResult] = useState(null); // { blob, url, meta }
  const [addPost, setAddPost] = useState()

  const { avatarUrl, _id: userId, userFullname} = loggedInUser
  

  const handleUploaded = (url) => {
    setImgUrl(url);
    setStep("crop");
  };

  const handleCropped = (blob, url, meta) => {
  
    setCropResult({ blob, url, meta });
    // keep imgUrl so Back from compose returns to crop
    setStep("compose");
  };

  const handleShare = async ( ) => {

     async function uploadFromCropResult(cropResult) {
  // 1) Get bytes from the blob: URL
  const resp = await fetch(cropResult.url)
  const blob = await resp.blob()

  // 2) Wrap in a File so Cloudinary sees a filename/extension
  const type = blob.type || 'image/png'
  const ext = type.split('/')[1] || 'png'
  const file = new File([blob], `crop.${ext}`, { type })

  // 3) Build a minimal "event" object your existing function expects
  const fakeEvent = { target: { files: [file] } }

  // 4) Reuse your unchanged uploadImg(ev)
  return uploadService.uploadImg(fakeEvent)}

  const imgData = await uploadFromCropResult(cropResult)
  console.log(imgData.secure_url)
   

    
    onClose();
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

        {step === "post"}



      </div>
    </div>
  );
}
