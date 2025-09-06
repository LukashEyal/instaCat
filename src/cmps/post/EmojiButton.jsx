// ./post/EmojiButton.jsx
import { PostButton } from './PostButton.jsx';
import emoji from '../../assets/svgs/post-container/emoji.svg';

export function EmojiButton({ onClick, className = '', title = 'Emoji' }) {
  return (
    <button
      type="button"
      className={`emoji-button ${className}`}
      onClick={onClick}
      aria-label={title}
      title={title}
    >
      <PostButton path={emoji} />
    </button>
  );
}
export default EmojiButton;
