// --- msg.reducer.js ---
export const SET_MSGS = 'SET_MSGS'
export const ADD_MSG = 'ADD_MSG'
export const INC_UNREAD = 'INC_UNREAD'
export const CLEAR_UNREAD = 'CLEAR_UNREAD'

const initialState = {
  msgs: [],
  unreadCount: 0,
}

export function msgReducer(state = initialState, action = {}) {
  switch (action.type) {
    case SET_MSGS:
      return { ...state, msgs: action.msgs }

    case ADD_MSG: {
      // avoid dupes (by _id if exists, otherwise by tempId)
      if (action.msg?._id) {
        const exists = state.msgs.some(m => m._id === action.msg._id)
        if (exists) return state
      }
      return { ...state, msgs: [...state.msgs, action.msg] }
    }

    case INC_UNREAD:
      return { ...state, unreadCount: state.unreadCount + 1 }

    case CLEAR_UNREAD:
      return { ...state, unreadCount: 0 }

    default:
      return state
  }
}
