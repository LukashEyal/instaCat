import { storageService } from '../async-storage.service.js'
import { utilService } from '../util.service.js'
import { httpService } from '../http.service.js'
// import instaData from '../db/instaCatData.json' assert { type: 'json' }

const STORAGE_KEY_LOGGEDIN_USER = 'loggedinUser'

export const userService = {
	query,
	get,
	getLoggedinUser,
	getUsers,
	login,
	signUp,
	saveLocalUser,
	logout,
}

async function signUp(userCred) {
	const user = await httpService.post('auth/signup', userCred)
	return user
}

async function login(userCred) {
	const user = await httpService.post('auth/login', userCred)
	if (user) {
		// return saveLocalUser(user)
		return user
	}
}

async function logout() {
	await httpService.post('auth/logout')
	sessionStorage.removeItem(STORAGE_KEY_LOGGEDIN_USER)
}

function saveLocalUser(user) {
	user = { _id: user._id, username: user.username }
	sessionStorage.setItem(STORAGE_KEY_LOGGEDIN_USER, JSON.stringify(user))
	return user
}

// function _createUsers() {
// 	let users = utilService.loadFromStorage(USER_KEY)
// 	if (!users || !users.length) {
// 		utilService.saveToStorage(USER_KEY, instaData.users)
// 	}
// }

function query() {
	return storageService.query(USER_KEY)
}

async function get(userId) {
	const user = await httpService.get(`user/${userId}`)
	return user
}

// async function getLoggedinUser(userId) {
// 	const user = await httpService.get(`user/${userId}`)
// 	return user
// }

function getLoggedinUser() {
	return JSON.parse(sessionStorage.getItem(STORAGE_KEY_LOGGEDIN_USER))
}

function getUsers() {
	try {
		const users = httpService.get(`user`)
		return users || []
	} catch (err) {
		console.error('Failed to load userDB from localStorage:', err)
		return []
	}
}
