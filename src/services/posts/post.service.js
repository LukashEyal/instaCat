import { storageService } from '../async-storage.service.js';
import { utilService } from '../util.service.js';
import instaData from '../db/instaCatData.json' assert { type: 'json' };

const POST_KEY = 'postDB';

_createPosts();

export const postService = {
  query,
  get,
  toggleLike,
};

function _createPosts() {
  let posts = utilService.loadFromStorage(POST_KEY);
  if (!posts || !posts.length) {
    posts = instaData.posts.map(post => ({
      ...post,
      isLiked: false,
      likes: post.likeBy.length
    }));
    utilService.saveToStorage(POST_KEY, posts);
  }
}

function query() {
  return storageService.query(POST_KEY);
}

function get(postId) {
  return storageService.get(POST_KEY, postId);
}

export async function toggleLike(postId, userId) {
  const post = await get(postId)
  const updatedPost = { ...post }

  const idx = updatedPost.likeBy.indexOf(userId)
  if (idx === -1) {
    updatedPost.likeBy.push(userId)
    updatedPost.likes++
  } else {
    updatedPost.likeBy.splice(idx, 1)
    updatedPost.likes--
  }

  return storageService.put(POST_KEY, updatedPost)
}
