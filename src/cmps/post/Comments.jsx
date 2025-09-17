// Comments.jsx
import React, { useMemo } from "react";
import { formatDistanceToNow } from "date-fns";
import { useSelector } from "react-redux";
import avatarPlaceHolder from "../../assets/svgs/post-container/avatar-placeholder.svg";

export function Comments({ comments = [] }) {
  const users = useSelector(s => s.userModule.users);

  const usersById = useMemo(() => {
    const map = new Map();
    for (const u of users) map.set(u._id, u);
    return map;
  }, [users]);

  if (!comments.length) return <div className="comments-list empty">No comments yet</div>;

  return (
    <div className="comments-list">
      {comments.map((c, idx) => {
        const user = usersById.get(c.userId);
        const displayName = user?.username || "Unknown";
        const avatar = user?.avatarUrl || avatarPlaceHolder;

        const ts = c.createdAt ?? c.createAt;
        const timeAgo = ts ? formatDistanceToNow(new Date(ts), { addSuffix: true }) : "";

        return (
          <div key={c._id || `${c.userId}-${ts || idx}`} className="comment-row">
            <img className="comment-avatar" src={avatar} alt={`${displayName} avatar`} />
            <div className="comment-main">
              <span className="comment-line">
                <strong className="comment-username">{displayName}</strong>{" "}
                <span className="comment-text">{c.comment}</span>
              </span>
              {timeAgo && <span className="comment-time">{timeAgo.replace(/^about\s+/, '')}</span>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
