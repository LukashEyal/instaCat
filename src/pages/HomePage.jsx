import { UserSideBar } from '../cmps/UserSideBar'
import { useSelector } from 'react-redux'
import { useEffect } from 'react'
import { loadPosts } from '../store/posts.actions'
import { Post } from '../cmps/post/Post'
import { loadUsers } from '../store/user.actions'

export function HomePage() {
	const loggedInUser = useSelector(storeState => storeState.userModule.user)
	const posts = useSelector(store => store.postsModule.posts)
	const users = useSelector(store => store.userModule.users)

	useEffect(() => {
		loadPosts()
		loadUsers()
	}, [])

	return (
		<div className="main-layout">
			<div className="feed-container">
				{posts.map(post => {
					const postUser = users.find(
						user => user._id === post.userId
					)
					return (
						<Post
							key={post._id}
							post={post}
							user={loggedInUser}
							postUser={postUser}
						/>
					)
				})}
			</div>
			<UserSideBar />
		</div>
	)
}
