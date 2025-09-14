// user.reducer.js (add fields + two actions)
export const UPSERT_USER = "UPSERT_USER"
export const UPSERT_USERS = "UPSERT_USERS"
export const SET_USER = "SET_USER"
export const SET_WATCHED_USER = "SET_WATCHED_USER"
export const REMOVE_USER = "REMOVE_USER"
export const SET_USERS = "SET_USERS"
export const SET_SCORE = "SET_SCORE"

const initialState = {
  user: null,
  users: [],
  usersById: {}, // NEW
}

export function userReducer(state = initialState, action) {
  switch (action.type) {
    case SET_USERS: {
      const byId = { ...state.usersById }
      for (const u of action.users) byId[u._id] = u
      return { ...state, users: action.users, usersById: byId }
    }

    case UPSERT_USER: {
      const u = action.user
      return {
        ...state,
        usersById: { ...state.usersById, [u._id]: u },
        users: state.users.some((x) => x._id === u._id)
          ? state.users
          : [...state.users, u],
      }
    }

    case UPSERT_USERS: {
      const byId = { ...state.usersById }
      const add = []

      for (const u of action.users) {
        const key = u._id || u.id // ✅ handle both
        if (!key) continue // skip if no id at all

        if (!byId[key]) {
          add.push(u) // only add to array if truly new
        }
        byId[key] = u // upsert in map
      }

      return {
        ...state,
        usersById: byId,
        users: [...state.users, ...add],
      }
    }

    case SET_USER:
      return { ...state, user: action.user }

    case SET_WATCHED_USER:
      return { ...state, watchedUser: action.user }

    case REMOVE_USER: {
      const users = state.users.filter((u) => u._id !== action.userId)
      const { [action.userId]: _, ...usersById } = state.usersById // keep map in sync
      return { ...state, users, usersById }
    }

    case SET_SCORE:
      return { ...state, user: { ...state.user, score: action.score } }

    default:
      return state
  }
}
