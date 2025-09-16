export const SET_POSTS = 'SET_POSTS'
export const UPDATE_POST = 'UPDATE_POST'

export const TOGGLE_LIKE_OPTIMISTIC = 'TOGGLE_LIKE_OPTIMISTIC'
export const TOGGLE_LIKE_UNDO = 'TOGGLE_LIKE_UNDO'

const initialState = {
	posts: [],
	post: [],
}

function toggleUserInArray(arr, userId) {
	return arr.includes(userId)
		? arr.filter(id => id !== userId)
		: [...arr, userId]
}

export function postsReducer(state = initialState, action) {
	var newState = state

	switch (action.type) {
		case SET_POSTS:
			newState = { ...state, posts: action.posts }
			break

		case UPDATE_POST:
			return {
				...state,
				posts: state.posts.map(post =>
					post._id === action.post._id ? action.post : post
				),
			}

		case TOGGLE_LIKE_OPTIMISTIC: {
			const { postId, userId } = action.payload
			return {
				...state,
				posts: state.posts.map(p => {
					if (p._id !== postId) return p
					const wasLiked = p.likeBy.includes(userId)
					return {
						...p,
						likeBy: toggleUserInArray(p.likeBy, userId),
						likes:
							(p.likes ?? p.likeBy.length) + (wasLiked ? -1 : 1),
						_optimistic: {
							...(p._optimistic || {}),
						},
					}
				}),
			}
		}

		case TOGGLE_LIKE_UNDO: {
			const { postId, userId } = action.payload
			return {
				...state,
				posts: state.posts.map(p => {
					if (p._id !== postId) return p

					const nowLiked = p.likeBy.includes(userId)
					const next = {
						...p,
						likeBy: toggleUserInArray(p.likeBy, userId),
						likes:
							(p.likes ?? p.likeBy.length) + (nowLiked ? -1 : 1),
					}

					return next
				}),
			}
		}

		default:
	}
	return newState
}

// unitTestReducer()

// function unitTestReducer() {
//     var state = initialState
//     const car1 = { _id: 'b101', vendor: 'Car ' + parseInt(Math.random() * 10), msgs: [] }
//     const car2 = { _id: 'b102', vendor: 'Car ' + parseInt(Math.random() * 10), msgs: [] }

//     state = carReducer(state, { type: SET_CARS, cars: [car1] })
//     console.log('After SET_CARS:', state)

//     state = carReducer(state, { type: ADD_CAR, car: car2 })
//     console.log('After ADD_CAR:', state)

//     state = carReducer(state, { type: UPDATE_CAR, car: { ...car2, vendor: 'Good' } })
//     console.log('After UPDATE_CAR:', state)

//     state = carReducer(state, { type: REMOVE_CAR, carId: car2._id })
//     console.log('After REMOVE_CAR:', state)

//     const msg = { id: 'm' + parseInt(Math.random() * 100), txt: 'Some msg' }
//     state = carReducer(state, { type: ADD_CAR_MSG, carId: car1._id, msg })
//     console.log('After ADD_CAR_MSG:', state)

//     state = carReducer(state, { type: REMOVE_CAR, carId: car1._id })
//     console.log('After REMOVE_CAR:', state)
// }

// case SET_CAR:
//     newState = { ...state, car: action.car }
//     break
// case REMOVE_CAR:
//     const lastRemovedCar = state.cars.find(car => car._id === action.carId)
//     cars = state.cars.filter(car => car._id !== action.carId)
//     newState = { ...state, cars, lastRemovedCar }
//     break
// case ADD_CAR:
//     newState = { ...state, cars: [...state.cars, action.car] }
//     break
// case UPDATE_CAR:
//     cars = state.cars.map(car => (car._id === action.car._id) ? action.car : car)
//     newState = { ...state, cars }
//     break
// case ADD_CAR_MSG:
//     newState = { ...state, car: { ...state.car, msgs: [...state.car.msgs || [], action.msg] } }
//     break
