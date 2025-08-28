// import { isAuth } from '@/lib/utils'
// import Post from '@/models/Post'
// import { isValidObjectId } from 'mongoose'
// import { NextApiHandler } from 'next'

// const handler: NextApiHandler = async (req, res) => {
//   const { method } = req
//   switch (method) {
//     case 'GET':
//       return getPostLikeStatus(req, res)

//     default:
//       res.status(404).send('Not found !!')
//   }
// }

// const getPostLikeStatus: NextApiHandler = async (req, res) => {
//   const user = await isAuth(req, res)

//   const { postId } = req.query as { postId: string }
//   if (!isValidObjectId(postId))
//     return res.status(422).json({ error: 'Invalid post Id ! :) ' })


// const post = await Post.findById(postId).select('likes')
//  if (!post)
//     return res.status(404).json({ error: "Post not found ! :) " })

// const postLikes = post.likes || []
// if(!user) {
//   return  res.json({
//     likesCount:postLikes.length,
//     likedByOwner: false,
//   })
// }
// res.json({
//     likesCount:postLikes.length,
//     likedByOwner: postLikes.includes(user.id as any)
//   })
// }

// export default handler





 //? Вариант B (эффективный при очень больших массивах лайков)

import type { NextApiHandler } from 'next'
import dbConnect from '@/lib/dbConnect'
import { isAuth } from '@/lib/utils'
import Post from '@/models/Post'
import { isValidObjectId, Types } from 'mongoose'

const handler: NextApiHandler = async (req, res) => {
  if (req.method !== 'GET') return res.status(404).send('Not found !!')

  const user = await isAuth(req, res)
  const postId = String(req.query.postId ?? '')
  if (!isValidObjectId(postId)) {
    return res.status(422).json({ error: 'Invalid post Id ! :) ' })
  }

  await dbConnect()

  const _id = new Types.ObjectId(postId)
  const userId = user ? new Types.ObjectId(user.id) : null

  const pipeline: any[] = [
    { $match: { _id } },
    {
      $project: {
        _id: 0,
        newLikes: { $size: { $ifNull: ['$likes', []] } },
        likedByOwner: userId
          ? { $in: [userId, { $ifNull: ['$likes', []] }] }
          : false,
      },
    },
  ]

  const agg = await Post.aggregate<{ newLikes: number; likedByOwner: boolean }>(pipeline)
  if (agg.length === 0) return res.status(404).json({ error: 'Post not found ! :) ' })

  res.setHeader('Cache-Control', 'no-store, max-age=0')
  res.setHeader('Pragma', 'no-cache')
  res.setHeader('Expires', '0')

  return res.status(200).json(agg[0]) // { newLikes, likedByOwner }
}

export default handler
