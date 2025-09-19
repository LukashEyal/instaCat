// Signup.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router'
import { signup } from '../store/user.actions'
import { userService } from '../services/user'
import { AvatarUploader } from './AvatarUploader.jsx'
import avatarPlaceHolder from '../assets/svgs/post-container/avatar-placeholder.svg'

export function Signup({ onDone }) {
	const [credentials, setCredentials] = useState(userService.getEmptyUser())
	const [avatarUrl, setAvatarUrl] = useState('')
	const [isSubmitting, setIsSubmitting] = useState(false)
	const navigate = useNavigate()

	function clearState() {
		setCredentials({ username: '', password: '', avatarUrl: '' })
		setAvatarUrl('')
	}

	function handleChange(ev) {
		const { name, value } = ev.target
		setCredentials(prev => ({ ...prev, [name]: value }))
	}

	const isValid =
		credentials.username.trim() !== '' && credentials.password.trim() !== ''

	async function onSignup(ev) {
		if (ev) ev.preventDefault()
		if (!isValid || isSubmitting) return
		setIsSubmitting(true)
		try {
			// trim fields before sending
			const payload = {
				...credentials,
				username: credentials.username.trim(),
				password: credentials.password.trim(),
			}

			if (avatarUrl) {
				payload.avatarUrl = avatarUrl
			} else {
				payload.avatarUrl = avatarPlaceHolder
			}

			await signup(payload)
			clearState()
			onDone?.()
			navigate('/')
		} catch (err) {
			console.error('Signup failed:', err)
		} finally {
			setIsSubmitting(false)
		}
	}

	function onUploaded(imgUrl) {
		setAvatarUrl(imgUrl)
	}

	return (
		<form className="signup-form" onSubmit={onSignup} noValidate>
			{/* Avatar uploader + preview (avatar is the trigger) */}
			<AvatarUploader onUploaded={onUploaded}>
				{({ openPicker, isUploading }) => (
					<button
						type="button"
						className="signup-avatar"
						onClick={openPicker}
						aria-label="Upload profile image"
						aria-busy={isUploading || undefined}
					>
						<img
							className="signup-avatar__img"
							src={avatarUrl || avatarPlaceHolder}
							alt="Profile avatar preview"
						/>
						<span className="signup-avatar__badge">
							{isUploading ? 'Uploading…' : 'Change'}
						</span>
					</button>
				)}
			</AvatarUploader>

			<input
				type="text"
				name="username"
				value={credentials.username}
				placeholder="Username"
				onChange={handleChange}
				required
			/>
			<input
				type="password"
				name="password"
				value={credentials.password}
				placeholder="Password"
				onChange={handleChange}
				required
			/>

			<button type="submit" disabled={!isValid || isSubmitting}>
				{isSubmitting ? 'Signing up…' : 'Signup'}
			</button>
		</form>
	)
}
