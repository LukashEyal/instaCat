import React, { useMemo } from "react";
import { formatDistanceToNow } from "date-fns";

export function Comments({ comments = [], users = [] }) {
  // Build a fast lookup: userId -> user
  const usersById = useMemo(() => {
    const map = new Map();
    for (const u of users) map.set(u._id, u);
    return map;
  }, [users]);

  if (!comments.length) {
    return <div className="comments-list empty">No comments yet</div>;
  }

  return (
    <div className="comments-list">
      {comments.map((c, idx) => {
        const user = usersById.get(c.userId);
        const displayName = user?.username

      
        const ts = c.createdAt ?? c.createAt;
        const timeAgo = ts
          ? formatDistanceToNow(new Date(ts), { addSuffix: true })
          : "";

        return (
          <div key={c._id || `${c.userId}-${ts || idx}`} className="comment-item">
            <span className="user-id">
              <strong>{displayName}</strong>
            </span>
            <span className="comment-text">{c.comment}</span>
            {timeAgo && <span className="comment-time">{timeAgo}</span>}
          </div>
        );
      })}
    </div>
  );
}
