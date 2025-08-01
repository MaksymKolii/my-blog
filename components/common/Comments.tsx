import { FC, Fragment, useEffect, useState } from 'react'
import CommentForm from './CommentForm'
import { GitHubAuthButton } from '../button'
import useAuth from '@/hooks/useAuth'
import { CommentResponse } from '@/utils/types'
import axios from 'axios'
import CommentCard from './CommentCard'
import ConfirmModal from './ConfirmModal'

interface IComments {
  belongsTo?: string
  fetchAll?: boolean
}

const Comments: FC<IComments> = ({ belongsTo }): JSX.Element => {
  const [comments, setComments] = useState<CommentResponse[]>()
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [commentToDelete, setCommentToDelete] =
    useState<CommentResponse | null>(null)
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

  const updateEditedComment = (newComment: CommentResponse) => {
    if (!comments) return

    let updatedComments = [...comments]
    // To update the we can only change the content
    // if edited comment is chief
    if (newComment.chiefComment) {
      const index = updatedComments.findIndex(({ id }) => id === newComment.id)
      updatedComments[index].content = newComment.content
    }
    // otherwise updating comment from replies
    else {
      const chiefCommentIndex = updatedComments.findIndex(
        ({ id }) => id === newComment.repliedTo,
      )

      let newReplies = updatedComments[chiefCommentIndex].replies
      newReplies = newReplies?.map((comment) => {
        if (comment.id === newComment.id) comment.content = newComment.content
        return comment
      })
      updatedComments[chiefCommentIndex].replies = newReplies
    }

    setComments([...updatedComments])
  }

  const updateDeletedComments1 = (deletedComment: CommentResponse) => {
    if (!comments) return

   
    let newComments = [...comments]

    if (deletedComment.chiefComment)
      newComments = newComments.filter(({ id }) => id !== deletedComment.id)
    else {
      const chiefCommentIndex = newComments.findIndex(
        ({ id }) => id === deletedComment.repliedTo,
      )
      newComments[chiefCommentIndex].replies = newComments[chiefCommentIndex].replies?.filter(({id})=> id !== deletedComment.id)
    }
    setComments([...newComments])
  }

 const updateDeletedComments = (deletedComment: CommentResponse) => {
  setComments(prev => {
    if (!prev) return prev 

    const updated = [...prev]

    if (deletedComment.chiefComment) {
      return updated.filter(({ id }) => id !== deletedComment.id)
    }

    const chiefIndex = updated.findIndex(({ id }) => id === deletedComment.repliedTo)
    if (chiefIndex === -1) return updated

    const replies = updated[chiefIndex].replies?.filter(({ id }) => id !== deletedComment.id)
    updated[chiefIndex] = {
      ...updated[chiefIndex],
      replies,
    }

    return updated
  })
}
 const updateLikeComments1 = (likedComment: CommentResponse) => {
  //console.log('likedComment:', likedComment);
 if (!comments) return

   
    let newComments = [...comments]

    if (likedComment.chiefComment)
      newComments = newComments.map(comment => {
    if(comment.id === likedComment.id) return likedComment
    return comment
  
  })
    else {
      const chiefCommentIndex = newComments.findIndex(
        ({ id }) => id === likedComment.repliedTo,
      )
      newComments[chiefCommentIndex].replies = newComments[chiefCommentIndex].replies?.map((reply)=>{

        if(reply.id === likedComment.id) return likedComment
        return reply
      } )
    }
    setComments([...newComments])
}

const updateLikeComments = (likedComment: CommentResponse) => {
  setComments(prev => {
    if (!prev) return prev;

    const updated = [...prev];

    if (likedComment.chiefComment) {
      return updated.map(comment =>
        comment.id === likedComment.id ? likedComment : comment
      );
    }

    const chiefIndex = updated.findIndex(({ id }) => id === likedComment.repliedTo);
    if (chiefIndex === -1) return updated;

    const replies = updated[chiefIndex].replies?.map(reply =>
      reply.id === likedComment.id ? likedComment : reply
    );

    updated[chiefIndex] = {
      ...updated[chiefIndex],
      replies,
    };

    return updated;
  });
};


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

  const handleUpdateSubmit = async (content: string, id: string) => {
    try {
      const { data } = await axios.patch(`/api/comment?commentId=${id}`, {
        content,
      })
      updateEditedComment(data.comment)
    } catch (error) {
      console.error('Error update comment:', error)
    }
  }

  const handleOnDeleteClick = async (comment: CommentResponse) => {
    setCommentToDelete(comment)
    setShowConfirmModal(true)
  }
  const handleOnDeleteCancel = async () => {
    setCommentToDelete(null)
    setShowConfirmModal(false)
  }
  const handleOnDeleteConfirm = async () => {
    // if (!commentToDelete) return
    // axios
    //   .delete(`/api/comment?commentId=${commentToDelete.id}`)
    //   .then(({ data }) => {
    //     if (data.removed) updateDeletedComments(commentToDelete)
    //   })
    //   .catch((error) => console.error('Error update comment:', error))
    //   .finally(() => {
    //     setCommentToDelete(null)
    //     setShowConfirmModal(false)
    //   })
    if (!commentToDelete) return
    try {
      const { data } = await axios.delete(
        `/api/comment?commentId=${commentToDelete.id}`,
      )
      if (data.removed) updateDeletedComments(commentToDelete)
    } catch (error) {
      console.error('Error update comment:', error)
    }
    setCommentToDelete(null)
    setShowConfirmModal(false)
    // console.log('commentToDelete:', commentToDelete)
  }

const handleOnLikeClick =(comment: CommentResponse) =>{
  axios.post('/api/comment/update-like', {commentId:comment.id}).then(({data})=> updateLikeComments(data.comment)).catch(err =>console.log(err))
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
              key={comment.id}
              comment={comment}
              showControls={userProfile?.id === comment.owner?.id}
              onReplySubmit={(content) =>
                handleReplySubmit({ content, repliedTo: comment.id })
              }
              onUpdateSubmit={(content) =>
                handleUpdateSubmit(content, comment.id)
              }
              onDeleteClick={() => handleOnDeleteClick(comment)}
                onLikeClick={()=>handleOnLikeClick(comment)}
            />
            {replies?.length ? (
              <div className=" w-[93%] ml-auto space-y-3">
                <h1 className="text-secondary-dark mb-3">Replies </h1>
                {replies.map((reply) => {
                  return (
                    <CommentCard
                      key={reply.id}
                      showControls={userProfile?.id === reply.owner?.id}
                      comment={reply}
                      onReplySubmit={(content) =>
                        handleReplySubmit({ content, repliedTo: comment.id })
                      }
                      onUpdateSubmit={(content) =>
                        handleUpdateSubmit(content, reply.id)
                      }
                      onDeleteClick={() => handleOnDeleteClick(reply)}
                      onLikeClick={()=>handleOnLikeClick(reply)}
                    />
                  )
                })}
              </div>
            ) : null}
          </Fragment>
        )
      })}
      <ConfirmModal
        visible={showConfirmModal}
        title="Do you really want to delete this comment?"
        subTitle="This will remove the comment and all its replies if it's a top-level comment!"
        onCancel={handleOnDeleteCancel}
        onConfirm={handleOnDeleteConfirm}
      />
    </div>
  )
}

export default Comments
