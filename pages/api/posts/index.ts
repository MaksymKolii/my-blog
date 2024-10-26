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
	const {files, body} = await readFile(req)

	 // Создаем новый объект для преобразования типов
	 const transformedBody: Record<string, string | undefined> = {};
	  // Преобразуем значения полей в строки, если они массивы
	
	  for (const key in body) {
		const value = body[key];
		transformedBody[key] = Array.isArray(value) ? value[0] : value; // Если значение - массив, берем первый элемент
	  }
	//   for (const key in body) {
	//     if (Array.isArray(body[key])) {
	// 		let value = (body)[key]
	// 		transformedBody[key] = Array.isArray(value) ? value[0] : value; // Если значение - массив, берем первый элемент
	//     }
	//   }
	let tags =[]
	if(transformedBody.tags) {
		try {
			tags =JSON.parse(transformedBody.tags as unknown as string)
		} catch (error) {
			return res.status(400).json({ error: "Invalid format for tags" });
		}
	}
	const errorMessage = validateSchema(postValidationSchema, {...transformedBody, tags})

	console.log('Body',transformedBody);

	//* старый вариант not work because fornData return obj with arrays inside
	// const { files, body } = await readFile(req)
	// let tags = []

	// if (body.tags) tags = JSON.parse(body.tags as unknown as string)
	// const errorMessage = validateSchema(postValidationSchema, { ...body, tags })
	// console.log('Body', body)

	if (errorMessage)
		return res.status(400).json({
			error: errorMessage, // возвращает первое найденное сообщение об ошибке
		})

	// Валидация пройдена, можно продолжить обработку запроса
	res.json({ success: true })
}
export default handler
