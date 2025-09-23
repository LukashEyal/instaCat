// --- msg.reducer.js ---
export const SET_MSGS = 'SET_MSGS'
export const ADD_MSG  = 'ADD_MSG'

const initialState = {
  msgs: []
}

export function msgReducer(state = initialState, action = {}) {
  switch (action.type) {
    case SET_MSGS:
      return { ...state, msgs: action.msgs }

    case ADD_MSG:
      // avoid dupes (by _id if exists, otherwise by tempId)
      if (action.msg?._id) {
        const exists = state.msgs.some(m => m._id === action.msg._id)
        if (exists) return state
      }
      return { ...state, msgs: [...state.msgs, action.msg] }

    default:
      return state
  }
}
