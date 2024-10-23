import dbConnect from '@/lib/dbConnect'
import { NextApiHandler } from 'next'

const handler: NextApiHandler = async (req, res) => {
	const { method } = req
	switch (method) {
		case 'GET': {
			await dbConnect()
			res.json({ okk: true })
		}
	}
}
export default handler
