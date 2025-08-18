import { isAuth } from '@/lib/utils'
import Post from '@/models/Post'
import { isValidObjectId } from 'mongoose'
import { NextApiHandler } from 'next'

const handler: NextApiHandler = async (req, res) => {
  const { method } = req
  switch (method) {
    case 'GET':
      return getPostLikeStatus(req, res)

    default:
      res.status(404).send('Not found !!')
  }
}

const getPostLikeStatus: NextApiHandler = async (req, res) => {
  const user = await isAuth(req, res)

  const { postId } = req.query as { postId: string }
  if (!isValidObjectId(postId))
    return res.status(422).json({ error: 'Invalid post Id ! :) ' })


const post = await Post.findById(postId).select('likes')
 if (!post)
    return res.status(404).json({ error: "Post not found ! :) " })

const postLikes = post.likes || []
if(!user) {
  return  res.json({
    likesCount:postLikes.length,
    likedByOwner: false,
  })
}
res.json({
    likesCount:postLikes.length,
    likedByOwner: postLikes.includes(user.id as any)
  })
}

export default handler


// //? Вариант A (простой и понятный)
// // pages/api/post/like-status.ts
// import type { NextApiHandler } from 'next'
// import dbConnect from '@/lib/dbConnect'
// import { isAuth } from '@/lib/utils'
// import Post from '@/models/Post'
// import { isValidObjectId, Types } from 'mongoose'

// const handler: NextApiHandler = async (req, res) => {
//   if (req.method !== 'GET') return res.status(404).send('Not found !!')
//   return getPostLikeStatus(req, res)
// }

// const getPostLikeStatus: NextApiHandler = async (req, res) => {
//   const user = await isAuth(req, res)

//   const { postId } = req.query as { postId?: string }
//   if (!postId || !isValidObjectId(postId)) {
//     return res.status(422).json({ error: 'Invalid post Id ! :) ' })
//   }

//   await dbConnect()

//   // Забираем только массив лайков, как plain-object
//   const doc = await Post.findById(postId)
//     .select('likes')
//     .lean<{ _id: Types.ObjectId; likes?: Types.ObjectId[] }>()
//   if (!doc) return res.status(404).json({ error: 'Post not found ! :) ' })

//   const likes = doc.likes ?? []
//   const likesCount = likes.length
//   const likedByOwner = user
//     ? likes.some((id) => id.toString() === user.id) // ← корректное сравнение
//     : false

//   // полезно отключить кэш в dev
//   res.setHeader('Cache-Control', 'no-store, max-age=0')
//   res.setHeader('Pragma', 'no-cache')
//   res.setHeader('Expires', '0')

//   return res.status(200).json({ likesCount, likedByOwner })
// }

// export default handler



//* ===================================================
//  //? Вариант B (эффективный при очень больших массивах лайков)
//  import type { NextApiHandler } from 'next'
// import dbConnect from '@/lib/dbConnect'
// import { isAuth } from '@/lib/utils'
// import Post from '@/models/Post'
// import { isValidObjectId, Types } from 'mongoose'

// const handler: NextApiHandler = async (req, res) => {
//   if (req.method !== 'GET') return res.status(404).send('Not found !!')
//   return getPostLikeStatus(req, res)
// }

// const getPostLikeStatus: NextApiHandler = async (req, res) => {
//   const user = await isAuth(req, res)
//   const { postId } = req.query as { postId?: string }
//   if (!postId || !isValidObjectId(postId)) {
//     return res.status(422).json({ error: 'Invalid post Id ! :) ' })
//   }

//   await dbConnect()

//   const _id = new Types.ObjectId(postId)

//   // 1) likesCount через $size
//   const agg = await Post.aggregate<{ likesCount: number }>([
//     { $match: { _id } },
//     { $project: { _id: 0, likesCount: { $size: { $ifNull: ['$likes', []] } } } },
//   ])
//   if (agg.length === 0) return res.status(404).json({ error: 'Post not found ! :) ' })
//   const likesCount = agg[0].likesCount

//   // 2) likedByOwner — через exists (если юзер не аутентифицирован, false)
//   let likedByOwner = false
//   if (user) {
//     const exists = await Post.exists({ _id, likes: new Types.ObjectId(user.id) })
//     likedByOwner = Boolean(exists)
//   }

//   res.setHeader('Cache-Control', 'no-store, max-age=0')
//   res.setHeader('Pragma', 'no-cache')
//   res.setHeader('Expires', '0')

//   return res.status(200).json({ likesCount, likedByOwner })
// }

// export default handler
