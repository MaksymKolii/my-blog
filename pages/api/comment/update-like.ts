import dbConnect from '@/lib/dbConnect'
import { formatComment, isAuth } from '@/lib/utils'
import Comment, { CommentModelSchema } from '@/models/Comment'

import { isValidObjectId, Schema, Types } from 'mongoose'

import { NextApiHandler } from 'next'

const handler: NextApiHandler = (req, res) => {
  const { method } = req

  switch (method) {
    case 'POST':
      return updateLike(req, res)

    default:
      res.status(404).send('Not found')
  }
}
const updateLike: NextApiHandler = async (req, res) => {
  const user = await isAuth(req, res)
  if (!user) return res.status(403).json({ error: 'Unauthorized request !' })

  const { commentId } = req.body

  if (!isValidObjectId(commentId))
    return res.status(422).json({ error: 'Invalid comment id !' })

  await dbConnect()
  const comment = await Comment.findById(commentId)
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

  if (!comment) return res.status(401).json({ error: 'Comment not found !' })

  const oldLikes = comment.likes || []

  const likedBy = new Types.ObjectId(
    // Maksym75 user id
    //'67752bd049cfe36ff83ebc2c',
    // maksymKolii
    // '67757df1073a7b9a95ac1686',
    user.id,
  ) as unknown as Schema.Types.ObjectId

  // like and unLike
  if (oldLikes.some((id) => id.toString() === likedBy.toString())) {
    comment.likes = oldLikes.filter(
      (id) => id.toString() !== likedBy.toString(),
    ) // Unlike
  } else {
    comment.likes = [...oldLikes, likedBy]
    // comment.likes.push(likedBy) // Like
  }

  //? indus ----------------------
  // const likedBy = '67757df1073a7b9a95ac1686' as any
  // // like and unLike
  // // This is for unlike
  // if (oldLikes.includes(likedBy)) {
  // 	comment.likes = oldLikes.filter(
  // 		like => like.toString() !== likedBy.toString()
  // 	)
  // }
  // this is to like comment
  // else comment.likes = [...oldLikes, likedBy]

  await comment.save()
  return res.status(201).json({
    comment: {
      ...formatComment(comment, user),

      replies: Array.isArray(comment.replies)
        ? comment.replies
            .filter(
              (r): r is CommentModelSchema =>
                typeof r === 'object' && 'content' in r,
            )
            .map((reply) => formatComment(reply, user))
        : [],

      // replies: (comment.replies as any[])?.map((repl)=>
      //    {return formatComment(repl, user)}),
    },
  })
}

export default handler
