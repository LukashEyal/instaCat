// import { utilService} from "../util.service.js"
// import { storageService } from "../async-storage.service.js"
// import instaData from './instaData.json' assert { type: 'json'}



// const INSTA_KEY = "instaDB"
// _createPosts()

// _loadPosts().then((posts) => {
//   console.log('Loaded posts:', posts)
// })

// export const instaService = {
//     query,
//     get,
//     // remove,
//     // save,
//     // getEmptyBook,
//     // getDefaultFilter,
//     likePost
// }


// function _loadPosts()

// {

// return storageService.query(INSTA_KEY)

// }



// function query() {

//     return storageService.query(INSTA_KEY).then((posts) => {

//         return posts

//     })

// }


// // function query(filterBy = {}) {
// //     return storageService.query(INSTA_KEY).then((books) => {
// //         // console.log("filterBy", filterBy)
// //         if (filterBy.txt) {
// //             const regExp = new RegExp(filterBy.txt, "i")
// //             books = books.filter((book) => regExp.test(book.title))
// //         }
// //         if (filterBy.categories) {
// //             books = books.filter(
// //                 (book) => book.categories[0] === filterBy.categories
// //             )
// //         }
// //         if (filterBy.maxPrice) {
// //             books = books.filter(
// //                 (book) => book.listPrice.amount <= filterBy.maxPrice
// //             )
// //         }
// //         return books
// //     })
// // }

// function get(postId) {
//     return storageService.get(INSTA_KEY, postId).then((post) => {

//       return post
//       })
// }

// function likePost(postId) {
//   return get(postId).then((post) => {
//     const updatedPost = { ...post }

//     // Toggle like
//     updatedPost.isLiked = !updatedPost.isLiked
//     updatedPost.likes += updatedPost.isLiked ? 1 : -1

//     // Save and return updated post
//     return storageService.put(INSTA_KEY, updatedPost)
//   })
// }



// // function remove(carId) {
// //     // return Promise.reject('Oh No!')
// //     return storageService.remove(INSTA_KEY, carId)
// // }

// // function save(post) {
// //     if (post.id) {
// //         return storageService.put(INSTA_KEY, post)
// //     } else {
// //         return storageService.post(INSTA_KEY, post)
// //     }
// // }

// // function getEmptyBook(name = "", description = "") {
// //     return { name, description }
// // }

// // function getDefaultFilter() {
// //     return { txt: "", maxPrice: 0, categories: "" }
// // }

// // function _setNextPrevCarId(car) {
// //     return query().then((cars) => {
// //         const carIdx = cars.findIndex((currCar) => currCar.id === car.id)
// //         const nextCar = cars[carIdx + 1] ? cars[carIdx + 1] : cars[0]
// //         const prevCar = cars[carIdx - 1]
// //             ? cars[carIdx - 1]
// //             : cars[cars.length - 1]
// //         car.nextCarId = nextCar.id
// //         car.prevCarId = prevCar.id
// //         return car
// //     })
// // }


// function _createPosts() {
//   let posts = utilService.loadFromStorage(INSTA_KEY);
//   if (!posts || !posts.length) {
//     // Use the posts from instaData.json
//     posts = instaData.posts.map(post => ({
//       ...post,
//       isLiked: false,
//       likes: post.likeBy.length
//     }));

//     utilService.saveToStorage(INSTA_KEY, posts);
//   }
// }
// // function _createBooks() {
// //  let books = loadFromStorage(INSTA_KEY)

// //  books = [
// //      _createBook(
// //          1,
// //          "Green Street Holigans",
// //          "Description about Green Street Hooligans"
// //      ),
// //      _createBook(2, "Harry Potter", "Description about Harry Potter"),
// //      _createBook(3, "Shrek and Fiona!", "Story about Shrek And Fiona"),
// //      _createBook(4, "Scar Face", "Desc about Scar Face"),
// //  ]
// //  saveToStorage(INSTA_KEY, books)

// // if (!books || !books.length) {
// //  books = [
// //      _createBook(
// //          1,
// //          "Green Street Holigans",
// //          "Description about Green Street Hooligans"
// //      ),
// //      _createBook(2, "Harry Potter", "Description about Harry Potter"),
// //      _createBook(3, "Shrek and Fiona!", "Story about Shrek And Fiona"),
// //      _createBook(4, "Scar Face", "Desc about Scar Face"),
// //  ]
// //  saveToStorage(INSTA_KEY, books)
// // }
// // }

// // function _createBook(id, name, description) {
// //  // return {
// //  //  id: makeId(),
// //  //  name,
// //  //  description,
// //  //  imgName: id + ".jpg", // or generate proper file names
// //  // }

// //  return {
// //      "id": makeId(),
// //      "title": "metus hendrerit",
// //      "description": "placerat nisi sodales suscipit tellus",
// //      "thumbnail": "http://ca.org/books-photos/20.jpg",
// //      "listPrice": {
// //      "amount": 109,
// //      "currencyCode": "EUR",
// //      "isOnSale": false
// //      }
// // }
// // }



















