import { ImgUploader } from "./ImgUploader";
import drag from "../../assets/svgs/drag.svg";

export function AddImage({ onUploaded }) {
  return (
    <div className="create-post-main-container" onClick={(e) => e.stopPropagation()}>
      <div className="create-post-header">
        <span>Create new post</span>
      </div>

      <div className="create-post-body">
        <div className="drag-container">
          <img src={drag} alt="Drag icon" className="drag-icon" />
          <p>Drag Photos and videos here</p>
          <ImgUploader onUploaded={onUploaded} />
        </div>
      </div>
    </div>
  );
}
