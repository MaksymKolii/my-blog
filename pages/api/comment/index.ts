import dbConnect from '@/lib/dbConnect'
import { formatComment, isAuth } from '@/lib/utils'
import { commentValidationSchema, validateSchema } from '@/lib/validator'
import Comment from '@/models/Comment'
import Post from '@/models/Post'
import { CommentResponse } from '@/utils/types'
import { isValidObjectId, Schema, Types } from 'mongoose'

import { NextApiHandler } from 'next'

const handler: NextApiHandler = (req, res) => {
  const { method } = req

  switch (method) {
    case 'POST':
      return createNewComment(req, res)
    case 'DELETE':
      return removeComment(req, res)
    case 'PATCH':
      return updateComment(req, res)
    case 'GET':
      return readComments(req, res)

    default:
      res.status(404).send('Not found')
  }
}

const readComments: NextApiHandler = async (req, res) => {
  const user = await isAuth(req, res)

  const { belongsTo } = req.query
  if (!belongsTo || !isValidObjectId(belongsTo)) {
    return res.status(422).json({ error: 'Invalid request!' })
  }

  // Ищем комментарий и заполняем поля owner и replies
  const comments = await Comment.find({ belongsTo })
    .populate({
      path: 'owner',
      select: 'name avatar',
    })
    .populate({
      path: 'replies',
      populate: {
        path: 'owner',
        select: 'name avatar',
      },
    })
    //.select('createdAt likes content repliedTo')

  if (!comments) return res.json({ comment: comments })

  const formattedComment: CommentResponse[] = comments.map((comment) => ({
    ...formatComment(comment, user),
    replies: comment.replies?.map((c: any) => formatComment(c, user)),
  }))

  res.json({ comments: formattedComment })
}

const createNewComment: NextApiHandler = async (req, res) => {
  const user = await isAuth(req, res)
  if (!user) return res.status(403).json({ error: 'Unauthorized request !' })

  const error = validateSchema(commentValidationSchema, req.body)
  if (error) return res.status(422).json({ error })

  // Create Comment
  await dbConnect()

  const { belongsTo, content } = req.body

  const post = await Post.findById(belongsTo)
  if (!post) return res.status(401).json({ error: 'Invalid Post !' })

  const comment = new Comment({
    content,
    belongsTo,
    // Maksym75 user id
    // owner: '67752bd049cfe36ff83ebc2c',
    // maksymKolii
    // owner: '67757df1073a7b9a95ac1686',
    owner: user.id,
    chiefComment: true,
  })
  await comment.save()
  const commentWithOwner = await comment.populate('owner')
  res.status(201).json({ comment: formatComment(commentWithOwner, user) })
}

// const removeComment: NextApiHandler = async (req, res) => {
// 	// const user = await isAuth(req, res)
// 	// if (!user) return res.status(403).json({ error: 'Unauthorized request !' })

// 	// if chief comment remove other related comments (replies) as well.
// 	// if this is the reply comment remove from the chiefComments replies section.
// 	// then remove the actual comment
// 	// /api/comment?commentId=commentId

// 	const { commentId } = req.query
// 	if (!commentId || !isValidObjectId(commentId))
// 		return res.status(422).json({ error: 'invalid request !!' })
// 	const comment = await Comment.findOne({
// 		_id: commentId,
// 		owner: '67752bd049cfe36ff83ebc2c',
// 	})
// 	if (!comment) return res.status(404).json({ error: 'Comment not found!!' })

// 	// if chief comment remove other related comments (replies) as well.
// 	if (comment.chiefComment) await Comment.deleteMany({ repliedTo: commentId })
// 	else {
// 		// if this is the reply comment remove from the chiefComments replies section.
// 		const chiefComment = await Comment.findById(comment.repliedTo)
// 		if (chiefComment?.replies?.includes(commentId as any)) {
// 			chiefComment.replies = chiefComment.replies.filter(
// 				cId => cId.toString() !== commentId
// 			)
// 			await chiefComment.save()
// 		}
// 	}
// 	// then remove the actual comment
// 	await Comment.findByIdAndDelete(commentId)
// 	res.json({ removed: true })
// }

const removeComment: NextApiHandler = async (req, res) => {
  const user = await isAuth(req, res)
  if (!user) return res.status(403).json({ error: 'Unauthorized request!' })

  const { commentId } = req.query // Используем query-параметры

  if (typeof commentId !== 'string' || !isValidObjectId(commentId)) {
    return res.status(422).json({ error: 'Invalid request!' })
  }

  const comment = await Comment.findOne({
    _id: commentId,
    // Замените на user.id после добавления аутентификации
    // Maksym75 user id
    // owner: '67752bd049cfe36ff83ebc2c',
    // maksymKolii
    // owner: '67757df1073a7b9a95ac1686',
    owner: user.id,
  })
  if (!comment) return res.status(404).json({ error: 'Comment not found!' })

  // Если это главный комментарий, удаляем все ответы
  if (comment.chiefComment) {
    await Comment.deleteMany({ repliedTo: commentId })
  } else {
    // Если это ответ, удаляем его из массива replies главного комментария
    const chiefComment = await Comment.findById(comment.repliedTo)
    if (
      chiefComment?.replies?.includes(
        new Types.ObjectId(commentId) as unknown as Schema.Types.ObjectId,
      )
    ) {
      chiefComment.replies = chiefComment.replies.filter(
        (cId) => cId.toString() !== new Types.ObjectId(commentId).toString(),
      )
      await chiefComment.save()
    }
  }

  // Удаляем сам комментарий
  await Comment.deleteOne({ _id: commentId })
  res.json({ removed: true })
}

const updateComment: NextApiHandler = async (req, res) => {
  const user = await isAuth(req, res)
  if (!user) return res.status(403).json({ error: 'Unauthorized request!' })

  const error = validateSchema(commentValidationSchema, req.body)
  if (error) return res.status(422).json({ error })

  const { commentId } = req.query
  if (typeof commentId !== 'string' || !isValidObjectId(commentId)) {
    return res.status(422).json({ error: 'Invalid request!' })
  }

  const comment = await Comment.findOne({
    _id: commentId,
    // Maksym75 user id
    // owner: '67752bd049cfe36ff83ebc2c',
    // maksymKolii
    //owner: '67757df1073a7b9a95ac1686',
    owner: user.id,
  }).populate('owner')
  if (!comment) return res.status(404).json({ error: 'Comment not found!' })

  comment.content = req.body.content
  await comment.save()
  res.json({comment :formatComment(comment)})
}

export default handler
