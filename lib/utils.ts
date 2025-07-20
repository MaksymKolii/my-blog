
import Post, { PostModelSchema } from '@/models/Post'
import { CommentResponse, PostDetail, UserProfile } from '../utils/types'
import formidable from 'formidable'
import { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from './dbConnect'
import { getServerSession } from 'next-auth'
import { authOptions } from '../pages/api/auth/[...nextauth]'
import { CommentModelSchema } from '@/models/Comment'
import { ObjectId, Schema, Types } from 'mongoose'

interface FormidablePromise<T> {
	files: formidable.Files
	// body: formidable.Fields;
	body: T
}

export const readFile = <T extends object>(
	req: NextApiRequest
): Promise<FormidablePromise<T>> => {
	//* formidable по умолчанию обрабатывает все поля как массивы.
	// const form = formidable({ multiples: true });
	const form = formidable()

	return new Promise((resolve, reject) => {
		form.parse(req, (err, fields, files) => {
			if (err) reject(err)

			resolve({ files, body: fields as T })
		})
	})
}
export const readPostsFromDb = async (limit: number, pageNumb: number, skip?: number) => {
	if (!limit || limit > 10)
		throw Error('Please USE limit under 10 !! and a valid pageNumb')
	const finalSkip = skip || limit * pageNumb
	await dbConnect()
	const posts = await Post.find()
		.sort({ createdAt: 'desc' })
		.select('-content')
		.skip(finalSkip)
		.limit(limit)
	return posts
}

export const formatPosts = (posts: PostModelSchema[]): PostDetail[] => {
	return posts.map(post => ({
		id:post._id.toString(),
		title: post.title,
		slug: post.slug,
		createdAt: post.createdAt.toString(),
		thumbnail: post.thumbnail?.url || '',
		meta: post.meta,
		tags: post.tags,
	}))
}
// export const is1Admin=  async(req:NextApiRequest, res:NextApiResponse) => {
// 	const session = await getServerSession(req, res, authOptions)
// 	// console.log('await getServerSession', session)

// 	  if (!session) {
// 			return res.status(401).json({ error: 'unauthorized request!!!!' })
// 		}
// 	const user = session.user as UserProfile
// 	if (!user || user.role !== 'admin')
// 		return res.status(401).json({ error: 'unauthorized request!!!!' })
// 	return true // Возвращаем true, если пользователь — администратор
// }

export const isAdmin = async (req: NextApiRequest, res: NextApiResponse) => {
	const session = await getServerSession(req, res, authOptions)
	const user = session?.user as UserProfile
	return user && user.role === 'admin'
}
export const isAuth = async (req: NextApiRequest, res: NextApiResponse) => {
	const session = await getServerSession(req, res, authOptions)
	const user = session?.user 
	if(user) return user as UserProfile
}


const getLikedByOwner = (likes: any[], user: UserProfile) => likes.includes(user.id)

// export const formatComment = (comment: CommentModelSchema, user?: UserProfile): CommentResponse => {
// 	 const owner = comment.owner as any
// 	return {
// 		id: comment._id.toString(),
// 		content: comment.content,
// 		likes: comment.likes.length,
// 		chiefComment: comment?.chiefComment || false,
// 		createdAt: comment.createdAt?.toString(),
// 		owner: user? {id: user.id, name:user.name,avatar:user.avatar} : null,
// 		// owner: { id: owner._id, name: owner.name, avatar: owner.avatar },
// 		 repliedTo: comment?.repliedTo?.toString(),
// 		 likedByOwner: user ? getLikedByOwner(comment.likes, user) : false,
// 	}
// }


// const getLikedByOwner = (
// 	likes: Schema.Types.ObjectId[],
// 	user: UserProfile
// ): boolean => likes.some(id => id.toString() === user.id)

export const formatComment = (
	comment: CommentModelSchema,
	user?: UserProfile
): CommentResponse => {
	const isOwnerPopulated = (
		val: ObjectId | { _id: ObjectId; name: string; avatar?: string }
	): val is { _id: ObjectId; name: string; avatar?: string } =>
		typeof val === 'object' && val !== null && 'name' in val && 'avatar' in val

		const owner = isOwnerPopulated(comment.owner)
		? {
				id: comment.owner._id.toString(),
				name: comment.owner.name ?? 'Unknown',
				avatar: comment.owner.avatar ?? '',
		  }
		: null

	return {
		id: comment._id.toString(),
		content: comment.content,
		likes: (comment.likes ?? []).length,
		chiefComment: comment.chiefComment ?? false,
		createdAt: comment.createdAt?.toLocaleString(),
		owner,
		repliedTo: comment?.repliedTo?.toString(),
		likedByOwner: user ? getLikedByOwner(comment.likes ?? [], user) : false,
	}
// const owner =
// 	comment.owner as any
// 	return {
// 		id: comment._id.toString(),
// 		content: comment.content,
// 		likes: (comment.likes ?? []).length,
// 		chiefComment: comment.chiefComment ?? false,
// 		createdAt: comment.createdAt?.toLocaleString(),
// 		// owner,
// 		 owner: { id: owner._id, name: owner.name, avatar: owner.avatar } ,
	
	
// 		repliedTo: comment?.repliedTo?.toString(),
// 		likedByOwner: user ? getLikedByOwner(comment.likes ?? [], user) : false,
	
// 	}
}
