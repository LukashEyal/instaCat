import { storageService } from '../async-storage.service.js';
import { saveToStorage, utilService } from '../util.service.js';
import instaData from '../db/instaCatData.json' assert { type: 'json' };
import { userService } from '../user/user.service.js'




const POST_KEY = 'postDB';

_createPosts();

export const postService = {
  query,
  get,
  toggleLike,
  getUsers,
  addComment
};

function _createPosts() {
  let posts = utilService.loadFromStorage(POST_KEY);
  const users = userService.getUsers();

  if (!posts || !posts.length) {
    posts = instaData.posts.map(post => {
      const user = users.find(u => u._id === post.userId) || null;
      return {
        ...post,
        user, // Add user object to the post
      };
    });
    
    utilService.saveToStorage(POST_KEY, posts);
  }
}

function query() {
  return storageService.query(POST_KEY);
}

function get(postId) {
  return storageService.get(POST_KEY, postId);
}

async function toggleLike(postId, userId) {
  console.log('post.service.js: fetching post with ID', postId)

  const posts = await storageService.query(POST_KEY)
  if (!Array.isArray(posts)) throw new Error('Posts not found or invalid format')

  const post = posts.find(p => p._id === postId)
  if (!post) throw new Error(`Post with ID ${postId} not found`)

  const updatedPost = { ...post }

  // ✅ Ensure likeBy is always an array
  

  if (updatedPost.likeBy.includes(userId)) {
    updatedPost.likeBy = updatedPost.likeBy.filter(id => id !== userId)
  } else {
    updatedPost.likeBy.push(userId)
  }

  // Save only the updated post, not the entire array
  await storageService.put(POST_KEY, updatedPost)

  return updatedPost
}


async function getUsers()

{
  const users = await userService.getUsers()
  return users




}



async function addComment({ postId, userId, text }) {
  // const post = await storageService.get(POST_KEY, postId); 
  // if (!post) throw new Error(`Post ${postId} not found`);

  // if (!Array.isArray(post.comments)) post.comments = [];

  const post = await storageService.get(POST_KEY, postId)
 
  
  const newId = await utilService.makeId()
  const newComment = {
    _id: newId,
    userId,
    text,
    createdAt: new Date().toISOString(),
  };

  const updatedPost = {
    ...post,
    comments: [...(post.comments || []), newComment],
  }

  

  await storageService.put(POST_KEY, updatedPost)
  return updatedPost

  // post.comments.push(newComment);

  // Persist and return updated post (adjust to your storage)
  // const updatedPost = await storageService.put(POST_KEY, post);
  // return updatedPost // or return post if you mutate in-memory
}


