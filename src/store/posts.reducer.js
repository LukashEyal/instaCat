export const SET_POSTS = 'SET_POSTS'
export const UPDATE_POST = 'UPDATE_POST'
export const UNFOLLOW_POST = 'UNFOLLOW_POST'
export const TOGGLE_LIKE_OPTIMISTIC = 'TOGGLE_LIKE_OPTIMISTIC'
export const TOGGLE_LIKE_UNDO = 'TOGGLE_LIKE_UNDO'
export const ADD_POST = 'ADD_POST'

const initialState = {
  posts: [],
  // consider removing `post` if unused
  post: [],
}

function toggleUserInArray(arr, userId) {
  return arr.includes(userId) ? arr.filter(id => id !== userId) : [...arr, userId]
}

export function postsReducer(state = initialState, action) {
  switch (action.type) {
    case SET_POSTS:
      return { ...state, posts: Array.isArray(action.posts) ? action.posts : [] }

    case ADD_POST: {
      const p = action.post
      // avoid duplicates if the socket may re-send the same post
      if (state.posts.some(x => x._id === p._id)) return state
      return { ...state, posts: [p, ...state.posts] }
    }

    case UPDATE_POST:
      return {
        ...state,
        posts: state.posts.map(p => (p._id === action.post._id ? action.post : p)),
      }

    case UNFOLLOW_POST: {
      const postId = action.post?._id ?? action.postId
      return { ...state, posts: state.posts.filter(p => p._id !== postId) }
    }

    case TOGGLE_LIKE_OPTIMISTIC: {
      const { postId, userId } = action.payload
      return {
        ...state,
        posts: state.posts.map(p => {
          if (p._id !== postId) return p
          const wasLiked = p.likeBy.includes(userId)
          return {
            ...p,
            likeBy: toggleUserInArray(p.likeBy, userId),
            likes: (p.likes ?? p.likeBy.length) + (wasLiked ? -1 : 1),
            _optimistic: { ...(p._optimistic || {}) },
          }
        }),
      }
    }

    case TOGGLE_LIKE_UNDO: {
      const { postId, userId } = action.payload
      return {
        ...state,
        posts: state.posts.map(p => {
          if (p._id !== postId) return p
          const nowLiked = p.likeBy.includes(userId)
          return {
            ...p,
            likeBy: toggleUserInArray(p.likeBy, userId),
            likes: (p.likes ?? p.likeBy.length) + (nowLiked ? -1 : 1),
          }
        }),
      }
    }

    default:
      return state
  }
}
