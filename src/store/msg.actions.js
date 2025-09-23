// --- msg.actions.js ---
import { httpService } from '../services/http.service'
import { store } from './store'
import { SET_MSGS, ADD_MSG } from './msg.reducer'

// PLAIN OBJECT action creator used by socket & optimistic UI
export function getActionSentMsg(msg) {
  return { type: ADD_MSG, msg }
}

// Load all msgs for the logged-in user (inbox/outbox up to you)
export async function loadMsgs(loggedInUserId) {
  const msgs = await httpService.get(`msg/${loggedInUserId}`)
  store.dispatch({ type: SET_MSGS, msgs })
  
}

// Send message via API. Return the saved message.
export async function sendMsg({ toUserId, fromUserId, txt }) {
  const saved = await httpService.post(`msg/`, { fromUserId, txt, toUserId })
  return saved
}
