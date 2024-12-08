import Post, { PostModelSchema } from '@/models/Post'
import { PostDetail } from '@/utils/types'
import formidable from 'formidable'
import { NextApiRequest } from 'next'
import dbConnect from './dbConnect'

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
