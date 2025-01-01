import mongoose from 'mongoose'

const uri = process.env.MONGODB_URI as string

const dbConnect = async () => {
	try {
		const connection = await mongoose.connect(uri)
		console.log('MONGODB_URI:', process.env.MONGODB_URI)

		return connection
	} catch (error) {
		console.log('Db connection fail -------============: ', error)
	}
}
export default dbConnect