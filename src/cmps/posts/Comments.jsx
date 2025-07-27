import React, { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { getUserNames } from '../../store/posts.actions';

export function Comments({ comments }) {
  const [usernames, setUsernames] = useState([]);

  useEffect(() => {
    const fetchUsernames = async () => {
      const userIds = comments.map(comment => comment.userId);
      console.log('User IDs:', userIds);

      try {
        const result = await getUserNames(userIds);
        console.log('Usernames:', result);
        setUsernames(result);
      } catch (err) {
        console.error('Failed to fetch usernames:', err);
      }
    };

    fetchUsernames();
  }, [comments]);

  console.log(usernames)

  return (
    <div className="comments-list">
      {comments.map((comment, i) => (
        <div key={comment._id} className="comment-item">
          <span className="user-id">
            <strong>{usernames[i] || comment.userId}</strong>
          </span>
          <span className="comment-text">{comment.txt}</span>
          <span className="comment-time">
            {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
          </span>
        </div>
      ))}
    </div>
  );
}
