import TipTapEditor, { FinalPost } from '@/components/editor'
import AdminLayout from '@/components/layout/AdminLayout'
import { generateFormData } from '@/utils/helper'
import axios from 'axios'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useState } from 'react'

interface ICreate {}

const Create: NextPage<ICreate> = () => {
	const [creating, setCreating] = useState(false)  
	const router = useRouter()
	const handleSubmit = async (post: FinalPost) => {
		setCreating(true)
		try {
			// we have to generate Form Data };
			const formData = generateFormData(post)
			// submit our post
			const { data } = await axios.post('/api/posts', formData)
			// console.log('!!! Created data !!!', data)
			//? push not work i will try replace!!
			router.push('/admin/posts/update/' + data.post.slug)
			// router.replace('/admin/posts/update/' + data.post.slug)

			
		} catch (error: any) {
			console.log(error.response.data)
		}
		setCreating(false)
	}

	return (
		<AdminLayout title='New Post'>
			<div className='max-w-4xl mx-auto'>
				<TipTapEditor onSubmit={handleSubmit} busy={creating} />
			</div>
		</AdminLayout>
	)
}
export default Create

