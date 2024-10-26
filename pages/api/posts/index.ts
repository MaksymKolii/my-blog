import dbConnect from '@/lib/dbConnect'
import { postValidationSchema } from '@/lib/validator'
import { NextApiHandler } from 'next'
import { validateSchema } from '@/lib/validator'
import { readFile } from '@/lib/utils'

//* убирает 404 {error: 'value must be of type object'}
export const config = {
	api: { bodyParser: false },
}

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

const createNewPost: NextApiHandler = async (req, res) => {
	//* work because formData return obj with arrays inside we need to Преобразуем значения полей в строки, если они массивы
	const { files, body } = await readFile(req)

	// Создаем новый объект для преобразования типов
	const transformedBody: Record<string, string | undefined> = {}
	// * 1 ------------  Преобразуем значения полей в строки, если они массивы-------------
	//*  Этот код проверяет каждое значение в body, и если значение является массивом, он берет первый элемент. Он будет преобразовывать все значения в transformedBody, даже если это не массивы. Это более универсальный подход, так как он охватывает все случаи, включая строки и другие типы данных.
	for (const key in body) {
		const value = body[key]
		transformedBody[key] = Array.isArray(value) ? value[0] : value // Если значение - массив, берем первый элемент
	}
	//*2 Этот код только проверяет, является ли значение массивом, и обрабатывает только такие значения. Если значение не является массивом, оно игнорируется в transformedBody. Этот подход может быть полезен, если вы точно знаете, что вам нужно работать только с массивами, и хотите избегать ненужного преобразования.
	//   for (const key in body) {
	//     if (Array.isArray(body[key])) {
	// 		let value = (body)[key]
	// 		transformedBody[key] = Array.isArray(value) ? value[0] : value; // Если значение - массив, берем первый элемент
	//     }
	//   }
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

	console.log('Body', transformedBody)
	// * --------------------------------------------------------------------------
	//* старый вариант not work because formData return obj with arrays inside

	// let tags = []

	// if (body.tags) tags = JSON.parse(body.tags as unknown as string)
	// const errorMessage = validateSchema(postValidationSchema, { ...body, tags })
	// console.log('Body', body)
	//* ---------------------------------------------------------------------------------
	if (errorMessage)
		return res.status(400).json({
			error: errorMessage, // возвращает первое найденное сообщение об ошибке
		})

	// Валидация пройдена, можно продолжить обработку запроса
	res.json({ success: true })
}
export default handler