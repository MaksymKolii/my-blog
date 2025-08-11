
import {  isAdmin } from '@/lib/utils'

import Comment from '@/models/Comment'
import { CommentPopulated } from '@/models/comment.types'

import { LatestComment } from '@/utils/types'


import { NextApiHandler } from 'next'


const handler: NextApiHandler = (req, res) => {
  const { method } = req

  switch (method) {

    case 'GET':
      return readLatestComments(req, res)

    default:
      res.status(404).send('Not found')
  }
}

const readLatestComments: NextApiHandler = async (req, res) => {
  const admin = await isAdmin(req, res)
  if(!admin) return res.status(403).json({error:"Unauthorized User!"})

const limit=6

  const comments = await Comment.find({ chiefComment: true })
  .populate({
      path: 'owner',
      select: 'name avatar',
    })
    .populate('owner')
  .limit(limit)
  .sort('-createdAt')
  .populate({
      path: 'belongsTo',
      select: 'title slug',
    })
    .lean<CommentPopulated[]>()

    const latestComments : LatestComment[] =comments.map((comm) => ({
        id: comm._id.toString(),
        content:comm.content,
        owner:{
            id: comm.owner._id.toString(),
            name:comm.owner.name,
            avatar: comm.owner.avatar,
        },
        belongsTo:{ 
            id:comm.belongsTo._id.toString(),
            title: comm.belongsTo.title,
            slug: comm.belongsTo.slug
        
        }
    }))

  res.json({ comments: latestComments })
}



export default handler
