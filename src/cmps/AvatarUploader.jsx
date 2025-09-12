// AvatarUploader.jsx
import React, { useRef, useState, useId } from "react";
import { uploadService } from "../services/upload.service.js";

export function AvatarUploader({ onUploaded, children }) {
  const [isUploading, setIsUploading] = useState(false);
  const fileRef = useRef(null);
  const inputId = useId();

  function openPicker() {
    fileRef.current?.click();
  }

  async function uploadImg(ev) {
    if (!ev.target.files?.[0]) return;
    setIsUploading(true);
    const { secure_url } = await uploadService.uploadImg(ev);
    console.log(secure_url)
    setIsUploading(false);
    onUploaded?.(secure_url);
  }

  return (
    <div className="upload-preview">
      <input
        ref={fileRef}
        id={inputId}
        type="file"
        accept="image/*"
        onChange={uploadImg}
        style={{ display: "none" }}
      />
      {typeof children === "function" ? (
        children({ openPicker, isUploading, inputId })
      ) : (
        <button type="button" className="select-btn" disabled={isUploading} onClick={openPicker}>
          {isUploading ? "Uploading…" : "Upload Profile Image"}
        </button>
      )}
    </div>
  );
}
