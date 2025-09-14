import { storageService } from '../async-storage.service.js'
import { utilService } from '../util.service.js'
import { httpService } from '../http.service.js'
import instaData from '../db/instaCatData.json' assert { type: 'json' }

// export const USER_KEY = 'userDB';

// _createUsers();

export const userService = {
	query,
	get,
	getLoggedinUser,
	getUsers,
	login,
	signUp,
}

async function signUp(userCred) {
	const user = await httpService.post('auth/signup', userCred)
	return user
}

async function login(userCred) {
	const user = await httpService.post('auth/login', userCred)
	return user
}

function _createUsers() {
	let users = utilService.loadFromStorage(USER_KEY)
	if (!users || !users.length) {
		utilService.saveToStorage(USER_KEY, instaData.users)
	}
}

function query() {
	return storageService.query(USER_KEY)
}

async function get(userId) {
	const user = await httpService.get(`user/${userId}`)
	return user
}

async function getLoggedinUser(userId) {
	const user = await httpService.get(`user/${userId}`)
	return user
}

function getUsers() {
	try {
		const users = utilService.loadFromStorage(USER_KEY)
		return users || []
	} catch (err) {
		console.error('Failed to load userDB from localStorage:', err)
		return []
	}
}
