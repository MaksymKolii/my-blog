import TipTapEditor, { FinalPost } from '@/components/editor'
import AdminLayout from '@/components/layout/AdminLayout'
import { NextPage } from 'next'

interface ICreate {}

const Create: NextPage<ICreate> = () => {

	const handleSubmit = (post:FinalPost)=>{


		// we have to generate Form Data }; 
		const formData =new FormData()
		formData.append('thumbnail',post.thumbnail)


		// submit your post


	}

	return (
		<AdminLayout title='New Post'>
			<div className='max-w-4xl mx-auto'>
				<TipTapEditor  onSubmit={handleSubmit} />
				{/* <TipTapEditor  onSubmit={uu => console.log('uu', uu)} 
					initialValue={{
						title:"This is from Create",
						meta:"Little meta description",
						content:"<h1>I am Header</h1>",
						slug:"this-is-from-create",
						tags:"javascript",
						thumbnail:
						// 'https://cdn.pixabay.com/photo/2024/07/29/02/28/snake-8928741_1280.jpg', 
						'https://images.unsplash.com/photo-1664784805210-9fa665e2b7e9?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw1fHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=500&q=60',}}/> */}
			</div>
		</AdminLayout>
	)
}

export default Create
