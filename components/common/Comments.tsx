import { FC, useState } from 'react'
import CommentForm from './CommentForm'
import { GitHubAuthButton } from '../button'
import useAuth from '@/hooks/useAuth'
import { CommentResponse } from '@/utils/types'
import axios from 'axios'

interface IComments {
	belongsTo?: string
	fetchAll?: boolean
}

const Comments: FC<IComments> = ({belongsTo}): JSX.Element => {

      const [comments, setComments] = useState<CommentResponse[]>()
			const [showConfirmModal, setShowConfirmModal] = useState(false)
			const [reachedToEnd, setReachedToEnd] = useState(false)
			const [busyCommentLike, setBusyCommentLike] = useState(false)
			const [submitting, setSubmitting] = useState(false)

    const userProfile = useAuth()



    const handleNewCommentSubmit = async (content: string) => {
        //   console.log(content);
				setSubmitting(true)
				try {
					const newComment = await axios
						.post('/api/comment', { content, belongsTo })
						.then(({ data }) => data.comment)
						.catch(err => console.log(err))
					if (newComment && comments) setComments([...comments, newComment])
					else setComments([newComment])
				} catch (error) {
					console.log(error)
				}

				setSubmitting(false)
			}
  return (
		<div className='py-20'>
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
		</div>
	)
}

export default Comments