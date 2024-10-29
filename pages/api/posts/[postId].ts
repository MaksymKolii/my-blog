
import { readFile } from '@/lib/utils'
import { postValidationSchema, validateSchema } from '@/lib/validator'
import Post from '@/models/post'
import { NextApiHandler } from 'next'

export const config = {
	api: { bodyParser: false },
}

const handler: NextApiHandler = (req, res) => {
	const { method } = req
	switch (method) {
		case 'PATCH':
			return updatePost(req, res)
		default:
			res.status(404).send('Not Found!')
	}
}

interface IncomingPost{
	title: string
	content: string
	slug:string
	meta:string
	tags:string
}
const updatePost: NextApiHandler = async (req, res) => {
	const postId = req.query.postId as string
	// await dbConnect()
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
			error: errorMessage, // возвращает первое найденное сообщение об ошибке
		})

	// Валидация пройдена, можно продолжить обработку запроса

	const { title, content, meta, slug } = transformedBody
	if (title) post.title = title
	if (meta) post.meta = meta
	if (content) post.content = content
	if (slug) post.slug = slug

	// update thumbnail only if there is any 2 options
	//* #1 - cond. => the post can already have thumbnail
	// so remove old, upload new image and then update record inside DB.
	//* #2-cond. => the post can be without thumbnail
	// just upload image and update record inside DB.

	await post.save()
	res.json({ post })
}

export default handler
