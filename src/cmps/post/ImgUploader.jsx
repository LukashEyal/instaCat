import { useRef, useState } from "react";
import { uploadService } from "../../services/upload.service.js";

export function ImgUploader({ onUploaded }) {
  const [isUploading, setIsUploading] = useState(false);
  const fileRef = useRef(null);

  async function uploadImg(ev) {
    if (!ev.target.files?.[0]) return;
    setIsUploading(true);
    const { secure_url, width, height } = await uploadService.uploadImg(ev);
    setIsUploading(false);
    onUploaded?.(secure_url); // notify the parent (and its parent)
  }

  return (
    <div className="upload-preview">
      <input
        ref={fileRef}
        id="imgUpload"
        type="file"
        accept="image/*"
        onChange={uploadImg}
        style={{ display: "none" }}
      />
      <button type="button" className="select-btn" disabled={isUploading}
              onClick={() => fileRef.current?.click()}>
        {isUploading ? "Uploading…" : "Select from computer"}
      </button>
    </div>
  );
}
