import dbConnect from '@/lib/dbConnect'
import { formatComment, isAuth } from '@/lib/utils'
import { commentValidationSchema, validateSchema } from '@/lib/validator'
import Comment from '@/models/Comment'
import { isValidObjectId } from 'mongoose'

import { NextApiHandler } from 'next'

const handler: NextApiHandler = (req, res) => {
  const { method } = req

  switch (method) {
    case 'POST':
      return addReplyToComment(req, res)

    default:
      res.status(404).send('Not found')
  }
}
const addReplyToComment: NextApiHandler = async (req, res) => {
  const user = await isAuth(req, res)
  if (!user) return res.status(403).json({ error: 'Unauthorized request !' })

  const error = validateSchema(commentValidationSchema, req.body)
  if (error) return res.status(422).json({ error })

  const { repliedTo } = req.body

  if (!isValidObjectId(repliedTo))
    return res.status(422).json({ error: 'Invalid comment id !' })

  await dbConnect()

  const chiefComment = await Comment.findOne({
    _id: repliedTo,
    chiefComment: true,
  })

  if (!chiefComment)
    return res.status(401).json({ error: 'Comment not found !' })

  const replyComment = new Comment({
    // Maksym75 user id
    // owner: '67752bd049cfe36ff83ebc2c',
    // maksymKolii
    // owner: '67757df1073a7b9a95ac1686',
    owner: user.id,
    repliedTo,
    content: req.body.content,
  })

  if (chiefComment.replies)
    chiefComment.replies = [...chiefComment.replies, replyComment._id]

  await chiefComment.save()
  await replyComment.save()

  const finalComment = await replyComment.populate('owner')
  res.status(201).json({ comment: formatComment(finalComment, user) })
}
export default handler
