import { postService } from '../services/posts/post.service'
import { socketService, SOCKET_EVENT_POST_UPDATED } from '../services/socket.service.js'
import {
  SET_POSTS,
  UPDATE_POST,
  TOGGLE_LIKE_OPTIMISTIC,
  TOGGLE_LIKE_UNDO,
  UNFOLLOW_POST,
} from './posts.reducer'

import { store } from './store'

export async function unFollowPost(post) {
  try {
    store.dispatch({ type: UNFOLLOW_POST, post })
  } catch (err) {
    console.log('Cannot Remove Post', err)
    throw err
  }
}

export async function loadPosts() {
  try {
    const posts = await postService.query()

    store.dispatch({ type: SET_POSTS, posts })
  } catch (err) {
    console.log('Cannot load posts', err)
    throw err
  }
}

export async function toggleLike(postId, userId) {
  // console.log("post.actions.js: toggleLike called with", postId, userId)

  try {
    const likedPost = await postService.toggleLike(postId, userId)
    const post = await postService.getById(postId)
    store.dispatch({ type: UPDATE_POST, post })
  } catch (err) {
    console.error('Cannot like post', err)
    throw err
  }
}

export async function toggleLikeOptimistic(postId, userId) {
  store.dispatch({
    type: TOGGLE_LIKE_OPTIMISTIC,
    payload: { postId, userId },
  })

  try {
    const likedPost = await postService.toggleLike(postId, userId)
  } catch (err) {
    console.error('Cannot like post', err)
    store.dispatch({ type: TOGGLE_LIKE_UNDO, payload: { postId, userId } })
    throw err
  }
}

export async function getFullNamesFromUserIds(userIds = []) {
  const allUsers = await postService.getUsers()

  // Filter users that are in the list
  const matchedUsers = allUsers.filter(user => userIds.includes(user._id))

  // Return only fullnames
  return matchedUsers.map(user => user.fullname)
}

export async function getUserNames(userIds = []) {
  const allUsers = await postService.getUsers()

  // Filter users that are in the list
  const matchedUsers = allUsers.filter(user => userIds.includes(user._id))

  // Return only fullnames
  return matchedUsers.map(user => user.username)
}

export async function addComment(commentInput) {
  try {
    const { postId, userId, text } = commentInput
    const payload = { postId, userId, text: text }

    const updatedPost = await postService.addComment(payload)

    // Update Redux
    store.dispatch({ type: UPDATE_POST, post: updatedPost })
  } catch (err) {
    console.error('Cannot Add Comment to post', err)
    throw err
  }
}

export async function AddPostAction(data) {
  console.log('Actions : ', data)

  const post = {
    content: data.content,
    location: data.location,
    imageUrl: data.imageUrl,
    user: data.user,
    userId: data.userId,
    likeBy: data.likeBy,
    comments: data.comments,
    createdAt: data.createdAt,
  }

  console.log('usedid :', post.userId)

  const addedPost = await postService.addPost(post)

  const posts = await postService.query()

  store.dispatch({ type: SET_POSTS, posts })

  return addedPost
}

export function getAddedPostAction(posts) {
  return loadPosts()
}

export function getUpdatedPost(post) {
  return loadPosts()
}

// onClick = {() => like(post._id, user._id)}
// export async function loadCar(carId) {
//     try {
//         const car = await carService.getById(carId)
//         store.dispatch(getCmdSetCar(car))
//     } catch (err) {
//         console.log('Cannot load car', err)
//         throw err
//     }
// }

// export async function removeCar(carId) {
//     try {
//         await carService.remove(carId)
//         store.dispatch(getCmdRemoveCar(carId))
//     } catch (err) {
//         console.log('Cannot remove car', err)
//         throw err
//     }
// }

// export async function addCar(car) {
//     try {
//         const savedCar = await carService.save(car)
//         store.dispatch(getCmdAddCar(savedCar))
//         return savedCar
//     } catch (err) {
//         console.log('Cannot add car', err)
//         throw err
//     }
// }

// export async function updateCar(car) {
//     try {
//         const savedCar = await carService.save(car)
//         store.dispatch(getCmdUpdateCar(savedCar))
//         return savedCar
//     } catch (err) {
//         console.log('Cannot save car', err)
//         throw err
//     }
// }

// export async function addCarMsg(carId, text) {
//     try {
//         const msg = await carService.addCarMsg(carId, text)
//         store.dispatch(getCmdAddCarMsg(msg))
//         return msg
//     } catch (err) {
//         console.log('Cannot add car msg', err)
//         throw err
//     }
// }

// // Command Creators:
// function getCmdSetPosts(posts) {
//     return {
//         type: SET_POSTS,
//         posts
//     }
// }
// function getCmdSetCar(car) {
//     return {
//         type: SET_CAR,
//         car
//     }
// }
// function getCmdRemoveCar(carId) {
//     return {
//         type: REMOVE_CAR,
//         carId
//     }
// }
// function getCmdAddCar(car) {
//     return {
//         type: ADD_CAR,
//         car
//     }
// }
// function getCmdUpdateCar(car) {
//     return {
//         type: UPDATE_CAR,
//         car
//     }
// }
// function getCmdAddCarMsg(msg) {
//     return {
//         type: ADD_CAR_MSG,
//         msg
//     }
// }

// // unitTestActions()
// async function unitTestActions() {
//     await loadCars()
//     await addCar(carService.getEmptyCar())
//     await updateCar({
//         _id: 'm1oC7',
//         title: 'Car-Good',
//     })
//     await removeCar('m1oC7')
//     // TODO unit test addCarMsg
// }
