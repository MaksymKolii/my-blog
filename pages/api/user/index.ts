import dbConnect from '@/lib/dbConnect'
import { isAdmin } from '@/lib/utils'
import User from '@/models/User'
import { LatestUserProfile } from '@/utils/types'
import { Types } from 'mongoose'

import { NextApiHandler } from 'next'

type UserLean = {
  _id: Types.ObjectId
  name: string
  email: string
  avatar?: string
//   role: 'user' | 'admin'
  createdAt?: Date 
  provider: string
}

const handler: NextApiHandler = (req, res) => {
  const { method } = req
  switch (method) {
    case 'GET':
      return getLatestUsers(req, res)
    default:
      res.status(404).send('Not Found!')
  }
}

const getLatestUsers: NextApiHandler = async (req, res) => {
  const admin = await isAdmin(req, res)
  if (!admin) return res.status(403).json({ error: 'Unauthorized Request!' })

//   const { pageNo = '0', limit = '5' } = req.query as {
//     pageNo: string
//     limit: string
//   }

//   const results = await User.find({ role: 'user' })
//     .sort({ createdAt: 'desc' })
//     .skip(parseInt(pageNo) * parseInt(limit))
//     .limit(parseInt(limit))
//     .select('name email avatar provider')

//   const users = results.map((u) => ({
//     id: u._id.toString(),
//     name: u.name,
//     email: u.email,
//     avatar: u.avatar,
//     role: u.provider,
//   }))
//   res.json({users})

  const pageNo = Number((req.query.pageNo ?? '0') as string)
    const limitRaw = Number((req.query.limit ?? '5') as string)
    const limit = Math.min(Math.max(1, limitRaw || 5), 20) // 1..20

    if (Number.isNaN(pageNo) || pageNo < 0)
      return res.status(422).json({ error: 'Invalid pageNo' })

    await dbConnect()

    const [users, total] = await Promise.all([
      User.find({ role: 'user' })
        .sort({ createdAt: -1 })   
        .skip(pageNo * limit)
        .limit(limit)
        .select('_id name email avatar role provider createdAt')
        .lean<UserLean[]>(),
      User.countDocuments({ role: 'user' }),
    ])
  const items:LatestUserProfile[] = users.map(u => ({
      id: u._id.toString(),
      name: u.name,
      email: u.email,
      avatar: u.avatar,
      provider: u.provider,
    //   role: u.role,
      
      createdAt: u.createdAt?.toISOString?.() ?? '',
    }))

   // const hasMore = (pageNo + 1) * limit < total
    const hasMore = (pageNo + 1) * limit < total

    return res.status(200).json({
      users: items,
    //   pageNo,
    //   limit,
    //   total,
    //   hasMore,
      pageNo,
      limit,
      total,
      hasMore,
    })
}

export default handler
