import { storageService } from '../async-storage.service.js';
import { utilService } from '../util.service.js';
import instaData from '../db/instaCatData.json' assert { type: 'json' };


export const USER_KEY = 'userDB';

_createUsers();

export const userService = {
  query,
  get,
  getLoggedinUser,
  getUsers
};

function _createUsers() {
  let users = utilService.loadFromStorage(USER_KEY);
  if (!users || !users.length) {
    utilService.saveToStorage(USER_KEY, instaData.users);
  }
}

function query() {
  return storageService.query(USER_KEY);
}

function get(userId) {
  return storageService.get(USER_KEY, userId);
}


function getLoggedinUser() {
  const users = utilService.loadFromStorage(USER_KEY);
  // Return a hardcoded default user (e.g., u1)
  return users?.find(user => user._id === 'u1') || null;
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