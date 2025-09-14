import { userService } from "../services/user/user.service"
// import { socketService } from '../services/socket.service'
import { store } from "../store/store"
import { UPSERT_USERS } from "./user.reducer"

import { showErrorMsg } from "../services/event-bus.service"

import {
  REMOVE_USER,
  SET_USER,
  SET_USERS,
  SET_WATCHED_USER,
} from "../store/user.reducer"
import { postService } from "../services/posts/post.service"

export async function loadUsers() {
  try {
    const users = await userService.query()
    store.dispatch({ type: SET_USERS, users })
  } catch (err) {
    console.log("UserActions: err in loadUsers", err)
  }
}

export async function removeUser(userId) {
  try {
    await userService.remove(userId)
    store.dispatch({ type: REMOVE_USER, userId })
  } catch (err) {
    console.log("UserActions: err in removeUser", err)
  }
}

export async function login(credentials) {
  try {
    const user = await userService.login(credentials)
    store.dispatch({
      type: SET_USER,
      user: user,
    })
    // socketService.login(user._id)
    return user
  } catch (err) {
    console.log("Cannot login", err)
    throw err
  }
}

export async function signup(credentials) {
  try {
    console.log("Action cred:", credentials)
    const user = await userService.signUp(credentials)
    console.log("user sign up", user)
    store.dispatch({
      type: SET_USER,
      user: user,
    })
    // socketService.login(user)
    return user
  } catch (err) {
    console.log("Cannot signup", err)
    throw err
  }
}

export async function logout() {
  try {
    await userService.logout()
    store.dispatch({
      type: SET_USER,
      user: null,
    })
    socketService.logout()
  } catch (err) {
    console.log("Cannot logout", err)
    throw err
  }
}

export async function loadUser(userId) {
  try {
    const user = userService.getLoggedinUser(userId)
    if (!user) throw new Error("No logged in user")

    store.dispatch({ type: SET_USER, user: user })
  } catch (err) {
    showErrorMsg("Cannot load user")
    console.error("Cannot load user", err)
  }
}

export async function getUser(userId) {
  try {
    const user = userService.get(userId)
    return user
  } catch (err) {
    throw err
  }
}

export async function ensureUsers(ids = []) {
  const state = store.getState()
  const have = state.userModule.usersById || {}
  const missing = ids.filter((id) => !have[id])
  if (!missing.length) return

  const users = await Promise.all(missing.map((id) => postService.getById(id)))
  const valid = users.filter(Boolean)
  store.dispatch({ type: UPSERT_USERS, users: valid })
}
