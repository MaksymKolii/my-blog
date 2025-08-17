
// import { NextApiHandler } from 'next'
// import { formatComment, isAdmin, isAuth } from '@/lib/utils'
// import Comment from '@/models/Comment'
// import { CommentResponse } from '@/utils/types'


// const handler: NextApiHandler = (req, res) => {
//   const { method } = req
//   switch (method) {
//     case 'GET':
//       return readComments(req, res)

//     default:
//       res.status(404).send('Not found')
//   }
// }

// const readComments: NextApiHandler = async (req, res) => {
//   const admin = await isAdmin(req, res)
//   const user = await isAuth(req, res)

//   if (!admin) return res.status(403).json({ error: 'You are not Authorized!' })

//   const { limit = '5', pageNo = '0' } = req.query as {
//     limit: string
//     pageNo: string
//   }

//   const comments =await Comment.find({})
//   .limit(parseInt(limit))
//   .skip(parseInt(limit) * parseInt(pageNo))
//   .sort({createdAt:'desc'})
//   .populate('owner')
//   .populate({
//     path:'replies',
//     populate: {
//         path:'owner',
//         select:'name avatar'
//     }
//     })

//          if (!comments) return res.json({ comment: comments })
//       const formattedComment: CommentResponse[] = comments.map((comment) => ({
//         ...formatComment(comment, user),
//         replies: comment.replies?.map((c: any) => formatComment(c, user)),
//       }))
    
//       res.json({ comments: formattedComment })
//     }


// export default handler


// // pages/api/comment/all.ts
// import type { NextApiHandler } from 'next'
// import dbConnect from '@/lib/dbConnect'
// import { isAdmin, isAuth, formatComment } from '@/lib/utils'
// import Comment from '@/models/Comment'
// import { isValidObjectId } from 'mongoose'
// import { CommentResponse } from '@/utils/types'

// const handler: NextApiHandler = async (req, res) => {
//   if (req.method !== 'GET') return res.status(404).send('Not found')

//   const admin = await isAdmin(req, res)
//   const user = await isAuth(req, res)
//   if (!admin) return res.status(403).json({ error: 'You are not Authorized!' })

//   // ---- query ----
//   const pageNoRaw = Number(req.query.pageNo ?? 0)
//   const limitRaw  = Number(req.query.limit ?? 5)
//   const pageNo = Number.isFinite(pageNoRaw) && pageNoRaw >= 0 ? pageNoRaw : 0
//   const limit  = Number.isFinite(limitRaw) ? Math.min(Math.max(1, limitRaw), 50) : 5

//   // опционально: фильтры
//   const belongsTo = req.query.belongsTo as string | undefined
//   const chiefOnly = req.query.chiefOnly === 'true'

//   const filter: Record<string, any> = {}
//   if (belongsTo && isValidObjectId(belongsTo)) filter.belongsTo = belongsTo
//   if (chiefOnly) filter.chiefComment = true

//   await dbConnect()

//   try {
//     const [rows, total] = await Promise.all([
//       Comment.find(filter)
//         .sort({ createdAt: -1 })
//         .skip(pageNo * limit)
//         .limit(limit)
//         .populate({ path: 'owner', select: 'name avatar' })
//         .populate({ path: 'replies', populate: { path: 'owner', select: 'name avatar' } })
//         .lean(),
//       Comment.countDocuments(filter),
//     ])

//     const comments:CommentResponse[] = rows.map((c: any) => ({
//       ...formatComment(c, user ?? undefined),
//       replies: Array.isArray(c.replies)
//         ? c.replies.map((r: any) => formatComment(r, user ?? undefined))
//         : [],
//     }))

//     const hasMore = (pageNo + 1) * limit < total

//     return res.status(200).json({
//       comments,
//       pageNo,
//       limit,
//       total,
//       hasMore,
//     })
//   } catch (e) {
//     console.error('GET /api/comment/all failed:', e)
//     return res.status(500).json({ error: 'Internal Server Error' })
//   }
// }

// export default handler


//? Но проще — включайте третий вариант и используйте его как /api/comment/all.

// pages/api/comment/all.ts
import type { NextApiHandler } from 'next'
import dbConnect from '@/lib/dbConnect'
import { isAdmin, isAuth, formatComment } from '@/lib/utils'
import Comment from '@/models/Comment'
import { isValidObjectId } from 'mongoose'
import { CommentResponse } from '@/utils/types'

const handler: NextApiHandler = async (req, res) => {
  if (req.method !== 'GET') return res.status(404).send('Not found')

  const admin = await isAdmin(req, res)
  const user = await isAuth(req, res)
  if (!admin) return res.status(403).json({ error: 'You are not Authorized!' })

  // ---- query ----
  const pageNoRaw = Number(req.query.pageNo ?? 0)
  const limitRaw  = Number(req.query.limit  ?? 5)

  // нормализуем лимит 1..50
  const limit = Number.isFinite(limitRaw) ? Math.min(Math.max(1, limitRaw), 50) : 5
  // сюда положим «запрошенную» страницу (потом зажмём к последней)
  const pageRequested = Number.isFinite(pageNoRaw) && pageNoRaw >= 0 ? pageNoRaw : 0

  // опциональные фильтры
  const belongsTo = req.query.belongsTo as string | undefined

  // chiefOnly: по умолчанию TRUE (главное изменение!)
  // можно явно передать ?chiefOnly=false чтобы получить все комменты (включая реплаи как отдельные записи)
  const chiefOnlyParam = req.query.chiefOnly as string | undefined
  const chiefOnly = chiefOnlyParam === undefined ? true : chiefOnlyParam === 'true'

  const filter: Record<string, unknown> = {}
  if (belongsTo && isValidObjectId(belongsTo)) filter.belongsTo = belongsTo
  if (chiefOnly) filter.chiefComment = true

  await dbConnect()

  try {
    // считаем total по тому же фильтру, чтобы знать последнюю страницу
    const total = await Comment.countDocuments(filter)
    const lastPage = Math.max(0, Math.ceil(total / limit) - 1)
    const pageNo = Math.min(pageRequested, lastPage)

    const rows = await Comment.find(filter)
      .sort({ createdAt: -1 })
      .skip(pageNo * limit)
      .limit(limit)
      .populate({ path: 'owner', select: 'name avatar' })
      .populate({
        path: 'replies',
        populate: { path: 'owner', select: 'name avatar' },
      })
      .lean()

    // приводим к CommentResponse без дублей
    const comments: CommentResponse[] = rows.map((c: any) => ({
      ...formatComment(c, user ?? undefined),
      replies: Array.isArray(c.replies)
        ? c.replies.map((r: any) => formatComment(r, user ?? undefined))
        : [],
    }))

    const hasMore = pageNo < lastPage

    // выключаем кэш (важно для dev)
    res.setHeader('Cache-Control', 'no-store, max-age=0')
    res.setHeader('Pragma', 'no-cache')
    res.setHeader('Expires', '0')

    return res.status(200).json({
      comments,
      pageNo,   // фактическая страница (могла быть скорректирована)
      limit,
      total,
      hasMore,
    })
  } catch (e) {
    console.error('GET /api/comment/all failed:', e)
    return res.status(500).json({ error: 'Internal Server Error' })
  }
}

export default handler
