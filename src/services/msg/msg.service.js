import { httpService } from '../http.service'

export const msgService = {
  query,
  sendMsg,
}

async function query(userId) {
  // GET /api/msg/:userId
  const res = await httpService.get(`msg/${userId}`)
  // Expecting an array of { _id, byUserId, toUserId, txt, createdAt }
  return res
}

async function sendMsg({ toUserId, fromUserId, txt }) {
  // If your backend route is POST /api/msg (body includes toUserId)
  return httpService.post('msg', { toUserId, fromUserId, txt })

  // If your backend is POST /api/msg/:toUserId use this instead:
  // return httpService.post(`msg/${toUserId}`, { fromUserId, txt })
}
