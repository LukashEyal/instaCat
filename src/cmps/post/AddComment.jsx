import { addComment } from "../../store/posts.actions";

export function AddComment({ postId, userId, text, onChange, inputRef }) {

  async function handleSubmit(e) {
    e.preventDefault();
    const trimmed = (text || "").trim();
    if (!trimmed) return;

    const comment = {
      postId,
      userId,
      text: trimmed,
    };

    await addComment(comment);
    onChange(""); // clear input after submit
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <input
        ref={inputRef}
        className="comment-input"
        type="text"
        value={text}
        placeholder="Add a comment..."
        onChange={(e) => onChange(e.target.value)}
      />
      {text.trim() && (
        <button type="submit" className="post-button">Post</button>
      )}
    </form>
  );
}
