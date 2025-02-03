import dbConnect from '@/lib/dbConnect'
import { isAuth } from '@/lib/utils'
import { commentValidationSchema, validateSchema } from '@/lib/validator'
import Comment from '@/models/Comment'

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
	if (!comment) return res.status(401).json({ error: 'Comment not found !' })

	const oldLikes = comment.likes || []

	const likedBy = new Types.ObjectId(
		// '67752bd049cfe36ff83ebc2c'
		user.id
	) as unknown as Schema.Types.ObjectId

	// like and unLike
	if (oldLikes.some(id => id.toString() === likedBy.toString())) {
		comment.likes = oldLikes.filter(id => id.toString() !== likedBy.toString()) // Unlike
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
	return res.status(201).json({ comment, likes: comment.likes.length })
}

export default handler
