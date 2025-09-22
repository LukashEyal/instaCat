import { useParams } from 'react-router-dom'

export function ExplorePost() {
	const { explorePostId } = useParams()
	return <div>ExplorePost {explorePostId}</div>
}
