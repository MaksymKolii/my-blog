export interface PostDetail {
  title: string
  id: string
  slug: string
  meta: string
  tags: string[]
  thumbnail?: string
  createdAt: string
}

export interface IncomingPost {
  title: string
  content: string
  slug: string
  meta: string
  tags: string
}

export interface UserProfile {
  id: string
  name: string
  email: string
  avatar: string | undefined
  role: 'user' | 'admin'
}

export type replyComments = CommentResponse[]

export interface CommentResponse {
  id: string
  content: string
  createdAt: string
  likes: number
  likedByOwner?: boolean
  replies?: replyComments
  repliedTo?: string
  chiefComment: boolean
  owner: { name: string; id: string; avatar?: string } | null
}
export interface LatestComment {
  id: string
  owner: {
    id: string
    name: string
    avatar?: string
  }
  content: string
  belongsTo: {
    id: string
    title: string
    slug: string
  }
}
