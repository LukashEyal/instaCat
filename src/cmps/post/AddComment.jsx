import { addComment } from "../../store/posts.actions";

export function AddComment({ postId, userId, text, onChange, inputRef }) {
  const canSubmit = Boolean(text?.trim());

  async function handleSubmit(e) {
    e.preventDefault();
    if (!canSubmit) return;

    const comment = {
      postId,
      userId,
      text: text.trim(),
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

      {/* Always render — disabled state controlled via CSS */}
      <button
        type="submit"
        className={`post-btn ${canSubmit ? "active" : ""}`}
        disabled={!canSubmit}
      >
        Post
      </button>
    </form>
  );
}
