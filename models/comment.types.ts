// /models/comment.types.ts
import { Types } from 'mongoose'
import type { CommentRaw } from './Comment'

export type PopulatedOwner = {
  _id: Types.ObjectId
  name: string
  avatar?: string
}

export type PopulatedPost = {
  _id: Types.ObjectId
  title: string
  slug: string
}

// Комментарий ПОСЛЕ populate(owner, belongsTo)
export type CommentPopulated =
  Omit<CommentRaw, 'owner' | 'belongsTo'> & {
    owner: PopulatedOwner
    belongsTo: PopulatedPost
  }
