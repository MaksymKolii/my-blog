import TipTapEditor, { FinalPost } from '@/components/editor'
import AdminLayout from '@/components/layout/AdminLayout'
import dbConnect from '@/lib/dbConnect'
import Post from '@/models/Post'
import { generateFormData } from '@/utils/helper'
import axios from 'axios'
import { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next'

interface PostResponse extends FinalPost {
	id: string
}

type IUpdate = InferGetServerSidePropsType<typeof getServerSideProps>

interface ServerSideResponse {
	post: PostResponse
}

const Update: NextPage<IUpdate> = ({ post }) => {
	const handleSubmit = async (post: FinalPost) => {
		try {
			const formData = generateFormData(post)
			const { data } = await axios.patch('/api/posts/' + post.id, formData)
			console.log('!!! Updated data !!!', data)
		} catch (error: any) {
			console.log(error.response.data)
		}
	}
	return (
		<AdminLayout title='Update'>
			<div className='max-w-4xl mx-auto'>
				<TipTapEditor
					initialValue={post}
					onSubmit={handleSubmit}
					btnTitle='Update'
				/>
			</div>
		</AdminLayout>
	)
}

export const getServerSideProps: GetServerSideProps<
	ServerSideResponse
> = async context => {
	try {
		const slug = context.query.slug as string
		// console.log('Context-=---=-=--===================================================1111111111111111',slug);
		await dbConnect()
		const post = await Post.findOne({ slug })
		if (!post) return { notFound: true }
		const { _id, title, content, tags, meta, thumbnail } = post
		return {
			props: {
				post: {
					//* Преобразуем _id в строку -- В MongoDB идентификаторы документов (_id) хранятся как ObjectId, который является специфическим типом данных, несущим не только уникальный ID, но и информацию о времени создания
					id: _id.toString(),
					title,
					content,
					//*  приведение массива tags к строковому формату, объединяя элементы массива через запятую т.к. tags from props - array
					tags: tags.join(', '),
					meta: meta,
					thumbnail: thumbnail?.url || '',
					slug,
				},
			},
		}
	} catch (error) {
		return { notFound: true }
	}
}

export default Update
