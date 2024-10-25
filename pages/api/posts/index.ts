import dbConnect from '@/lib/dbConnect'
import { postValidationSchema } from '@/lib/validator'
import { NextApiHandler } from 'next'
import { validateSchema } from '@/lib/validator'
const handler: NextApiHandler = async (req, res) => {
	const { method } = req
	switch (method) {
		case 'GET': {
			await dbConnect()
			res.json({ okkk: true })
		}
		case 'POST':
			return createNewPost(req, res)
	}
}

const createNewPost: NextApiHandler = (req, res) => {
	const { body } = req

	const errorMessage = validateSchema(postValidationSchema, body)

	if (errorMessage)
		return res.status(400).json({
			error: errorMessage, // возвращает первое найденное сообщение об ошибке
		})

	// Валидация пройдена, можно продолжить обработку запроса
	res.json({ success: true })
}
export default handler
