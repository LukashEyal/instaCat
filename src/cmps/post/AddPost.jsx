// ./post/AddPost.jsx
import backIcon from "../../assets/svgs/post-container/back.svg";
import upArrow from "../../assets/svgs/post-container/up-arrow.svg";
import downArrow from "../../assets/svgs/post-container/down-arrow.svg";
import locationIcon from "../../assets/svgs/post-container/location.svg";
import collaborator from "../../assets/svgs/post-container/collaborator.svg";

import { useEffect, useState } from "react";

import { EmojiButton} from "../post/EmojiButton.jsx";

function Section({ title, children, defaultOpen=false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="section">
      <button className="section-header" onClick={() => setOpen(!open)} aria-expanded={open}>
        <span>{title}</span>
        <span className="chev">{open ? <img src={upArrow} /> : <img src={downArrow} />}</span>
      </button>
      {open && <div className="section-body">{children}</div>}
    </div>
  );
}

export function AddPost({ imageBlob, onBack, onShare, userAvatar, UserFullName }) {
  const [url, setUrl] = useState(null);

  // right-side state
  const [caption, setCaption] = useState("");
  const [location, setLocation] = useState("");
  const [collabInput, setCollabInput] = useState("");
  const [collaborators, setCollaborators] = useState([]);
  const [shareTo, setShareTo] = useState({ facebook: false });
  const [altText, setAltText] = useState("");
  const [settings, setSettings] = useState({
    hideLikeCount: false,
    disableComments: false,
  });

  useEffect(() => {
    if (!imageBlob) return;
    const u = URL.createObjectURL(imageBlob);
   
    setUrl(u);
    return () => URL.revokeObjectURL(u);
  }, [imageBlob]);

  const addCollaborator = () => {
    const v = collabInput.trim();
    if (!v) return;
    if (!collaborators.includes(v)) setCollaborators((arr) => [...arr, v]);
    setCollabInput("");
  };
  const removeCollaborator = (name) =>
    setCollaborators((arr) => arr.filter((n) => n !== name));

  const handleShare = (e) => {
    e.preventDefault();
    onShare?.({
      blob: imageBlob,
      caption,
      location,
      collaborators,
      shareTo,
      altText,
      settings,
    });
  };



  return (
    <>
      <div className="create-post-header crop-header">
        <div className="header-left">
          <button className="back-btn" onClick={onBack} aria-label="Back">
            <img src={backIcon} alt="" />
          </button>
        </div>
        <div className="header-title">Create new post</div>
        <div className="header-right">
          <button className="next-btn" onClick={handleShare}>Share</button>
        </div>
      </div>

      <div className="add-post-body">
        <div className="cropped-image">{url && <img src={url} alt="Cropped" />}</div>

        {/* RIGHT SIDE */}
        <aside className="compose-right">
   
          <div className="account-row">
            <div className="avatar">
    <img src={userAvatar} alt="" />
  </div>
            <div className="account-name">{UserFullName}</div>
          </div>

          {/* caption */}
          
            <div className="caption-wrap">
         <textarea
  aria-label="Caption"
  maxLength={2200}
  value={caption}
  onChange={(e) => setCaption(e.target.value)}
/>

         <div className="emoji-counter-div">
  <EmojiButton className="emoji-btn" />
  <div className="counter">{caption.length}/2200</div>
</div>

            </div>
       <hr className="caption-divider" />

    

          {/* location */}
          <div className="location">
            <input className="location-input"
              type="text"
              placeholder="Add Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />

            <button className="location-button">
              <img src={locationIcon}></img>
            </button>
    
    </div>

          {/* collaborators */}

            <div className="collab-input">
              <input
                type="text"
                placeholder="Add collaorators"
                value={collabInput}
                onChange={(e) => setCollabInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addCollaborator()}
              />
              <button className="collab-btn" ><img src={collaborator}></img></button>
            </div>
            {!!collaborators.length && (
              <ul className="collab-list">
                {collaborators.map((name) => (
                  <li key={name}>
                    <span>@{name}</span>
                    <button type="button" onClick={() => removeCollaborator(name)} aria-label={`Remove ${name}`}>×</button>
                  </li>
                ))}
              </ul>
            )}
   

          {/* share to */}
          <Section title="Share to">
            <label className="toggle">
              <input
                type="checkbox"
                checked={shareTo.facebook}
                onChange={(e) =>
                  setShareTo((s) => ({ ...s, facebook: e.target.checked }))
                }
              />
              <span>Facebook</span>
            </label>
          </Section>

          {/* accessibility */}
          <Section title="Accessibility">
            <label className="field-label">Alt text</label>
            <textarea
              placeholder="Write alt text for your photo"
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
            />
          </Section>

          {/* advanced */}
          <Section title="Advanced settings">
            <label className="toggle">
              <input
                type="checkbox"
                checked={settings.hideLikeCount}
                onChange={(e) =>
                  setSettings((s) => ({ ...s, hideLikeCount: e.target.checked }))
                }
              />
              <span>Hide like counts</span>
            </label>
            <label className="toggle">
              <input
                type="checkbox"
                checked={settings.disableComments}
                onChange={(e) =>
                  setSettings((s) => ({ ...s, disableComments: e.target.checked }))
                }
              />
              <span>Turn off commenting</span>
            </label>
          </Section>
        </aside>
      </div>
    </>
  );
}
