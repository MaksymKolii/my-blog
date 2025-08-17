
import { NextApiHandler } from 'next'
import { formatComment, isAdmin, isAuth } from '@/lib/utils'
import Comment from '@/models/Comment'
import { CommentResponse } from '@/utils/types'


const handler: NextApiHandler = (req, res) => {
  const { method } = req
  switch (method) {
    case 'GET':
      return readComments(req, res)

    default:
      res.status(404).send('Not found')
  }
}

const readComments: NextApiHandler = async (req, res) => {
  const admin = await isAdmin(req, res)
  const user = await isAuth(req, res)

  if (!admin) return res.status(403).json({ error: 'You are not Authorized!' })

  const { limit = '5', pageNo = '0' } = req.query as {
    limit: string
    pageNo: string
  }

  const comments =await Comment.find({})
  .limit(parseInt(limit))
  .skip(parseInt(limit) * parseInt(pageNo))
  .sort({createdAt:'desc'})
  .populate('owner')
  .populate({
    path:'replies',
    populate: {
        path:'owner',
        select:'name avatar'
    }
    })

         if (!comments) return res.json({ comment: comments })
      const formattedComment: CommentResponse[] = comments.map((comment) => ({
        ...formatComment(comment, user),
        replies: comment.replies?.map((c: any) => formatComment(c, user)),
      }))
    
      res.json({ comments: formattedComment })
    }


export default handler


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
