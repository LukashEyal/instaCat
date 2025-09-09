import { httpService } from "../http.service"

export const postService = {
	query,
	getById,
	save,
	remove,
	addPostMsg,
	toggleLike,
	addPost,
}

// async function query(filterBy = { txt: "", price: 0 }) {
async function query(filterBy = {}) {
async function query(filterBy = {}) {
	return httpService.get(`post`, filterBy)
}

function getById(postId) {
	return httpService.get(`post/${postId}`)
}

async function remove(postId) {
	return httpService.delete(`post/${postId}`)
}

async function save(post) {
	var savedPost
	if (post._id) {
		savedPost = await httpService.put(`post/${post._id}`, post)
	} else {
		savedPost = await httpService.post("post", post)
	}
	return savedPost
}

async function addPostMsg(postId, txt) {
	const savedMsg = await httpService.post(`post/${postId}/msg`, { txt })
	return savedMsg
}

async function toggleLike(postId, userId) {
	return

	const likedPost = await httpService.patch(`post/${postId}/like`, {userId : userId})
	return likedPost

	

}

async function addPost(paylod) {
	console.log("payload serivce front", paylod)
	const addedPost = await httpService.post(`post/`, paylod)
	return addedPost
}
