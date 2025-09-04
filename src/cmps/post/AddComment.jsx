import { useState } from "react"
import { addComment, loadPosts } from "../../store/posts.actions"



export function AddComment({ postId, userId }) {

  
const [text, setText] = useState("")

  async function handleSubmit(e) {
    e.preventDefault()
    if (!text.trim()) return

    const comment = {
    
      postId: postId,
      
      userId: userId, 
      text: text,
      createdAt: new Date().toISOString()
    }

    
    await addComment(comment)

    setText("") // clear input after submit

  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <input 
        className="comment-input"
        type="text"
        value={text}
        placeholder="Add a comment..."
        onChange={(e) => setText(e.target.value)}
      />

      {text.trim() && <button type="submit" className="post-button">Post</button>}
    </form>
  )
}