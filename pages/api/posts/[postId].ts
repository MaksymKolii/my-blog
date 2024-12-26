import cloudinary from '@/lib/cloudinary'
import { isAdmin, readFile } from '@/lib/utils'
import { postValidationSchema, validateSchema } from '@/lib/validator'
import Post from '@/models/Post'
import { IncomingPost } from '@/utils/types'
import formidable from 'formidable'
import { NextApiHandler } from 'next'

export const config = {
	api: { bodyParser: false },
}

const handler: NextApiHandler = (req, res) => {
	const { method } = req
	switch (method) {
		case 'PATCH':
			return updatePost(req, res)
		case 'DELETE':
			return removePost(req, res)
		default:
			res.status(404).send('Not Found!')
	}
}

const removePost: NextApiHandler = async (req, res) => {

	const admin = await isAdmin(req, res)

	if (!admin) return res.status(401).json({ error: 'unauthorized request!!!!' })
	try {
		const postId = req.query.postId as string
		const deletedPost = await Post.findByIdAndDelete(postId)

		if (!deletedPost) return res.status(404).json({ error: 'Post not found!' })

		// remove thumbnail from post
		const publicId = deletedPost.thumbnail?.public_id
		if (publicId) {
			await cloudinary.uploader.destroy(publicId)
		}
		res.json({ removed: true })
	
} catch (error: any) {
	return res.status(500).json({ error: error.message})
}
}

const updatePost: NextApiHandler = async (req, res) => {

	const admin = await isAdmin(req, res)

	if (!admin) return res.status(401).json({ error: 'unauthorized request!!!!' })
	const postId = req.query.postId as string

	const post = await Post.findById(postId)
	if (!post) return res.status(404).json({ error: 'Post Not Found!' })

	const { files, body } = await readFile<IncomingPost>(req)

	const transformedBody: Record<string, string | undefined> = {}

	for (const key in body) {
		const value = body[key as keyof IncomingPost]
		transformedBody[key] = Array.isArray(value) ? value[0] : value
	}

	let tags = []
	if (transformedBody.tags) {
		try {
			tags = JSON.parse(transformedBody.tags as unknown as string)
		} catch (error) {
			return res.status(400).json({ error: 'Invalid format for tags' })
		}
	}
	const errorMessage = validateSchema(postValidationSchema, {
		...transformedBody,
		tags,
	})
	if (errorMessage)
		return res.status(400).json({
			error: errorMessage,
		})
	//*  Без этого tags не будет изменяться при update !!!
	if (Array.isArray(tags) && tags.length >= 0) {
		post.tags = tags
	}

	// Валидация пройдена, можно продолжить обработку запроса

	const { title, content, meta, slug } = transformedBody
	if (title) post.title = title
	if (meta) post.meta = meta
	if (content) post.content = content
	if (slug) post.slug = slug

	// update thumbnail only if there is any
	const thumbnail = files.thumbnail as formidable.File[]
	if (thumbnail && thumbnail.length > 0) {
		const { secure_url: url, public_id } = await cloudinary.uploader.upload(
			thumbnail[0].filepath,
			{ folder: 'dev-blogs' }
		)

		//* #1 - cond. => the post can already have thumbnail
		// so remove old, upload new image and then update record inside DB.

		const publicId = post.thumbnail?.public_id

		if (publicId) {
			await cloudinary.uploader.destroy(publicId)
		}
		//* #2-cond. => the post can be without thumbnail
		// just upload image and update record inside DB.
		post.thumbnail = { url, public_id }
	}

	await post.save()
	res.json({ post })
}

export default handler
