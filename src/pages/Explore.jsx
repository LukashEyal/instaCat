import { useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { postService } from '../services/posts/post.service'
import { useDispatch, useSelector } from 'react-redux'
import { SET_POSTS } from '../store/posts.reducer'

export function Explore() {
	const posts = useSelector(store => store.postsModule.posts)

	const dispatch = useDispatch()

	async function loadExplorePosts() {
		const posts = await postService.query()

		dispatch({ type: SET_POSTS, posts: posts })
	}

	function shuffle(arr) {
		const a = [...arr]
		for (let i = a.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1))
			;[a[i], a[j]] = [a[j], a[i]]
		}
		return a
	}

	useEffect(() => {
		if (posts.length > 0) return
		try {
			loadExplorePosts()
		} catch (err) {
			console.log('Cannot load explore posts, err', err)
		}
	}, [])

	const shuffled = useMemo(() => shuffle(posts), [posts])

	return (
		<div className="explore-container">
			<div className="explore-mid-container">
				{shuffled.map(explorePost => {
					console.log('explorePost:', explorePost)
					return (
						<Link
							to={`/p/${explorePost._id}`}
							key={explorePost._id}
						>
							<div className="explore-post">
								<img
									src={explorePost.imageUrl}
									alt="Explore Post"
									className="explore-post-image"
								/>
								<div className="explore-post-overlay">
									<span>
										❤️ {explorePost.likeBy.length ?? 0}
									</span>
									<span>
										💬 {explorePost.comments.length ?? 0}
									</span>
								</div>
							</div>
						</Link>
					)
				})}
			</div>
		</div>
	)
}
