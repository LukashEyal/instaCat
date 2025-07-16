import { instaService } from '../services/insta/insta.service'

import { SET_POSTS } from './posts.reducer'

import { store } from './store'

export async function loadPosts() {
    try {
        const posts = await instaService.query()
        store.dispatch( {type: SET_POSTS, posts})
    } catch (err) {
        console.log('Cannot load posts', err)
        throw err
    }
}

// export async function loadCar(carId) {
//     try {
//         const car = await carService.getById(carId)
//         store.dispatch(getCmdSetCar(car))
//     } catch (err) {
//         console.log('Cannot load car', err)
//         throw err
//     }
// }


// export async function removeCar(carId) {
//     try {
//         await carService.remove(carId)
//         store.dispatch(getCmdRemoveCar(carId))
//     } catch (err) {
//         console.log('Cannot remove car', err)
//         throw err
//     }
// }

// export async function addCar(car) {
//     try {
//         const savedCar = await carService.save(car)
//         store.dispatch(getCmdAddCar(savedCar))
//         return savedCar
//     } catch (err) {
//         console.log('Cannot add car', err)
//         throw err
//     }
// }

// export async function updateCar(car) {
//     try {
//         const savedCar = await carService.save(car)
//         store.dispatch(getCmdUpdateCar(savedCar))
//         return savedCar
//     } catch (err) {
//         console.log('Cannot save car', err)
//         throw err
//     }
// }

// export async function addCarMsg(carId, txt) {
//     try {
//         const msg = await carService.addCarMsg(carId, txt)
//         store.dispatch(getCmdAddCarMsg(msg))
//         return msg
//     } catch (err) {
//         console.log('Cannot add car msg', err)
//         throw err
//     }
// }

// // Command Creators:
// function getCmdSetPosts(posts) {
//     return {
//         type: SET_POSTS,
//         posts
//     }
// }
// function getCmdSetCar(car) {
//     return {
//         type: SET_CAR,
//         car
//     }
// }
// function getCmdRemoveCar(carId) {
//     return {
//         type: REMOVE_CAR,
//         carId
//     }
// }
// function getCmdAddCar(car) {
//     return {
//         type: ADD_CAR,
//         car
//     }
// }
// function getCmdUpdateCar(car) {
//     return {
//         type: UPDATE_CAR,
//         car
//     }
// }
// function getCmdAddCarMsg(msg) {
//     return {
//         type: ADD_CAR_MSG,
//         msg
//     }
// }

// // unitTestActions()
// async function unitTestActions() {
//     await loadCars()
//     await addCar(carService.getEmptyCar())
//     await updateCar({
//         _id: 'm1oC7',
//         title: 'Car-Good',
//     })
//     await removeCar('m1oC7')
//     // TODO unit test addCarMsg
// }
