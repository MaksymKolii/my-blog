// import { isAuth } from '@/lib/utils'
// import Post from '@/models/Post'
// import { isValidObjectId } from 'mongoose'
// import { NextApiHandler } from 'next'

// const handler: NextApiHandler = async (req, res) => {
//   const { method } = req
//   switch (method) {
//     case 'POST':
//       return updatePostLike(req, res)

//     default:
//       res.status(404).send('Not found !!')
//   }
// }

// const updatePostLike: NextApiHandler = async (req, res) => {
//   const user = await isAuth(req, res)
//   if (!user)
//     return res.status(401).json({ error: "You're not authorized ! :) " })

//   const { postId } = req.query as { postId: string }
//   if (!isValidObjectId(postId))
//     return res.status(422).json({ error: 'Invalid post Id ! :) ' })

// const post = await Post.findById(postId).select('likes')
//  if (!post)
//     return res.status(404).json({ error: "Post not found ! :) " })

// const oldLikes = post.likes || []
// const likedBy = user.id as any

// // unlike
// if(oldLikes.includes(likedBy)){
//   post.likes =  oldLikes.filter(lk =>lk.toString() !== likedBy.toString())
// }
// // like post
// else {
//      post.likes = [...oldLikes, likedBy] }

// await post.save()
// res.status(201).json({newLikes:post.likes.length})
// }

// export default handler



import type { NextApiHandler } from 'next'
import { isAuth } from '@/lib/utils'
import dbConnect from '@/lib/dbConnect'
import Post from '@/models/Post'
import { isValidObjectId, Types } from 'mongoose'

const handler: NextApiHandler = async (req, res) => {
  if (req.method !== 'POST') return res.status(404).send('Not found !!')

  const user = await isAuth(req, res)
  if (!user)
    return res.status(401).json({ error: "You're not authorized ! :)" })

//   const postId = String(req.query.postId ?? '')
//   if (!isValidObjectId(postId))
//     return res.status(422).json({ error: 'Invalid post Id ! :) ' })

  // 🔒 строгая нормализация
  const postIdParam = req.query.postId
  if (typeof postIdParam !== 'string') {
    return res.status(422).json({ error: 'Invalid postId param (must be string)' })
  }
  const postId = postIdParam.trim()
  if (!isValidObjectId(postId)) {
    return res.status(422).json({ error: 'Invalid post Id ! :) ' })
  }

  await dbConnect()

  const userId = new Types.ObjectId(user.id)

  // 1) Пытаемся снять лайк
  const pullRes = await Post.updateOne(
    { _id: postId, likes: userId },
    { $pull: { likes: userId } },
  )

  // Если ничего не сняли — значит лайка не было, ставим
  if (pullRes.modifiedCount === 0) {
    await Post.updateOne({ _id: postId }, { $addToSet: { likes: userId } })
  }

  // Берём актуальные данные
  const updated = await Post.findById(postId).select('_id likes').lean()
  if (!updated) return res.status(404).json({ error: 'Post not found ! :) ' })
  //   const likesCount = updated?.likes?.length ?? 0
  const newLikes = updated.likes?.length ?? 0

  // likedByOwner: итоговое состояние для текущего пользователя
  const likedByOwner = (updated?.likes ?? []).some(
    (id: any) => id.toString() === userId.toString(),
  )

  // отключим кэш (особенно полезно в dev)
  res.setHeader('Cache-Control', 'no-store, max-age=0')
  res.setHeader('Pragma', 'no-cache')
  res.setHeader('Expires', '0')

  return res.status(201).json({
    postId,
    newLikes,
    likedByOwner,
  })
}

export default handler
