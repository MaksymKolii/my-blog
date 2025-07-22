import { FC, Fragment, useEffect, useState } from 'react'
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

  const insertNewReplyComments = (reply: CommentResponse) => {
    if (!comments) return
    let updatedComments = [...comments]

    const chiefCommentIndex = updatedComments.findIndex(
      ({ id }) => id === reply.repliedTo,
    )
     const { replies } = updatedComments[chiefCommentIndex]
    updatedComments[chiefCommentIndex].replies = replies
      ? [...replies, reply]
      : [reply]

    // const { replies } = updatedComments[chiefCommentIndex]
    // if (replies) {
    //   updatedComments[chiefCommentIndex].replies = [...replies, reply]
    // } else {
    //   updatedComments[chiefCommentIndex].replies = [reply]
    // }
    setComments([...updatedComments])
  }

  // const handleNewCommentSubmit = async (content: string) => {
  //   setSubmitting(true)
  //   try {
  //     const newComment = await axios
  //       .post('/api/comment', { content, belongsTo })
  //       .then(({ data }) => data.comment)
  //       .catch((err) => console.log(err))
  //     // console.log(newComment)
  //     if (newComment && comments) setComments([...comments, newComment])
  //     else setComments([newComment])
  //   } catch (error) {
  //     console.log(error)
  //   }

  //   setSubmitting(false)
  // }
  // const handleReplySubmit = (replyComment: {
  //   content: string
  //   repliedTo: string
  // }) => {
  //   axios
  //     .post('/api/comment/add-reply', replyComment)
  //     .then(({ data }) => insertNewReplyComments(data.comment))
  //     .catch((err) => console.log(err))
  // }

  // useEffect(() => {
  //   axios(`/api/comment?belongsTo=${belongsTo}`)
  //     .then(({ data }) => {
  //       setComments(data.comments)
  //       // console.log(data.comments)
  //     })
  //     .catch((err) => console.log(err))
  // }, [belongsTo])

    const handleNewCommentSubmit = async (content: string) => {
    setSubmitting(true)
    try {
      const { data } = await axios.post('/api/comment', { content, belongsTo })
      const newComment = data.comment

      if (newComment && comments) {
        setComments([...comments, newComment])
      } else {
        setComments([newComment])
      }
    } catch (error) {
      console.error('Error creating comment:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleReplySubmit = async (replyComment: {
    content: string
    repliedTo: string
  }) => {
    try {
      const { data } = await axios.post('/api/comment/add-reply', replyComment)
      insertNewReplyComments(data.comment)
    } catch (error) {
      console.error('Error submitting reply:', error)
    }
  }

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const { data } = await axios(`/api/comment?belongsTo=${belongsTo}`)
        setComments(data.comments)
      } catch (err) {
        console.error('Error loading comments:', err)
      }
    }

    if (belongsTo) fetchComments()
  }, [belongsTo])
  return (
    <div className="py-20 space-y-4">
      {userProfile ? (
        <CommentForm onSubmit={handleNewCommentSubmit} title="Add comment" />
      ) : (
        <div className="flex flex-col items-end space-y-2">
          <h3 className="text-secondary-dark font-semibold text-xl dark:text-secondary-light">
            Log in to add comment
          </h3>
          <GitHubAuthButton />
        </div>
      )}

      {comments?.map((comment) => {
        const { replies } = comment
        return (
        
          <Fragment key={comment.id}>
            <CommentCard
              // key={comment.id}
              comment={comment}
              onReplySubmit={(content) =>
                handleReplySubmit({ content, repliedTo: comment.id })
              }
              onUpdateSubmit={(cont) => {
                console.log('Update: - ', cont)
              }}
            />
            {replies?.length ? (
              <div className=" w-[93%] ml-auto space-y-3">
                <h1 className="text-secondary-dark mb-3">Replies </h1>
                {replies?.map((reply) => {
                  return (
                    <CommentCard
                      key={reply.id}
                      comment={reply}
                      onReplySubmit={(content) =>
                        handleReplySubmit({ content, repliedTo: comment.id })
                      }
                      onUpdateSubmit={(cont) => {
                        console.log('Update: - ', cont)
                      }}
                    />
                  )
                })}
              </div>
            ) : null}
          </Fragment>
        )
      })}
    </div>
  )
}

export default Comments
