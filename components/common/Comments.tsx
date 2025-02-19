import { FC, useEffect, useState } from 'react'
import CommentForm from './CommentForm'
import { GitHubAuthButton } from '../button'
import useAuth from '@/hooks/useAuth'
import { CommentResponse } from '@/utils/types'
import axios from 'axios'
import CommentCard from './CommentCard'

interface IComments {
	belongsTo?: string
	fetchAll?: boolean
}

const Comments: FC<IComments> = ({ belongsTo }): JSX.Element => {
	const [comments, setComments] = useState<CommentResponse[]>()
	const [showConfirmModal, setShowConfirmModal] = useState(false)
	const [reachedToEnd, setReachedToEnd] = useState(false)
	const [busyCommentLike, setBusyCommentLike] = useState(false)
	const [submitting, setSubmitting] = useState(false)

	const userProfile = useAuth()

	const handleNewCommentSubmit = async (content: string) => {
		setSubmitting(true)
		try {
			const newComment = await axios
				.post('/api/comment', { content, belongsTo })
				.then(({ data }) => data.comment)
				.catch(err => console.log(err))
			// console.log(newComment)
			if (newComment && comments) setComments([...comments, newComment])
			else setComments([newComment])
		} catch (error) {
			console.log(error)
		}

		setSubmitting(false)
	}
	const handleReplaySubmit = (replyComment: { content: string; repliedTo: string }) => {
		axios
			 .post('/api/comment/add-reply', replyComment)
			.then(({ data }) => console.log('data.comment', data.comment))
			.catch(err => console.log(err))

	 }
	

	useEffect(() => {
		axios(`/api/comment?belongsTo=${belongsTo}`)
			.then(({ data }) => {
				setComments(data.comments)
				// console.log(data.comments)
			})
			.catch(err => console.log(err))
	}, [belongsTo])
	return (
		<div className='py-20 space-y-4'>
			{userProfile ? (
				<CommentForm onSubmit={handleNewCommentSubmit} title='Add comment' />
			) : (
				<div className='flex flex-col items-end space-y-2'>
					<h3 className='text-secondary-dark font-semibold text-xl dark:text-secondary-light'>
						Log in to add comment
					</h3>
					<GitHubAuthButton />
				</div>
			)}

			
			{comments?.map((comment) => {
				return (
					<CommentCard
						key={comment.id}
						comment={comment}
						onReplySubmit={content =>
							handleReplaySubmit({ content, repliedTo: comment.id })
						}
						onUpdateSubmit={cont => {
							console.log('Update: - ', cont)
						}}
					/>
				)
			})}
		</div>
	)
}

export default Comments
