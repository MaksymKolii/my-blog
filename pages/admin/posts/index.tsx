import PostCard from '@/components/common/PostCard'
import AdminLayout from '@/components/layout/AdminLayout'
import { NextPage } from 'next'
import { useState } from 'react'

interface IAdmin {}

const posts = [
	{
		title: 'This is my new post for now',
		slug: 'this-is-my-new-post-for-now',
		meta: "This is my first post, and typesetting industry. Lorem Ipsum has been the industry's standard",
		tags: ['post'],
		thumbnail:
			'https://images.pexels.com/photos/12967/pexels-photo-12967.jpeg? auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
		createdAt: 'Mon Oct 10 2022 14:58:49 GMT+0530 (India Standard Time)',
	},
	{
		title: ' The untold truth about useEffect hook',
		slug: 'the-untold-truth-about-useeffect-hook',
		meta: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.',
		tags: ['react', 'java script'],
		thumbnail:
			'https://images.pexels.com/photos/2246476/pexels-photo-2246476.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
		createdAt: 'Tue Oct 11 2022 14:58:49 GMT+0530 (India Standard Time)',
	},
	{
		title: ' Kotlin basics for android beginners',
		slug: 'how-to-practice-your-coding-skills',
		meta: 'Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making',
		tags: ['kotlin'],
		thumbnail:
			'https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg? auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
		createdAt: 'Tue Oct 11 2022 14:58:49 GMT+0530 (India Standard Time)',
	},
	{
		title: 'How Long to practice your coding skills and practice practice practice ',
		slug: 'how-to-practice-your-coding-skills',
		meta: 'Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making',
		tags: ['programming', 'Type Script', 'Next JS'],
		thumbnail:
			'https://images.pexels.com/photos/9503686/pexels-photo-9503686.jpeg? auto-compress&cs=tinysrgb&dpr=1&w=500',
		createdAt: 'Tue Oct 11 2022 14:58:49 GMT+0530 (India Standard Time)',
	},
	{
		title: ' The untold truth about useEffect hook',
		slug: 'the-untold-truth-about-useeffect-hook',
		meta: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.',
		tags: ['react js'],
		thumbnail:
			'https://res.cloudinary.com/dbdlhupgj/image/upload/v1730235285/dev-blogs/pgvj0awoeuk5pxixbpl6.jpg',
		createdAt: 'Tue Oct 11 2022 14:58:49 GMT+0530 (India Standard Time)',
	},
	{
		title: 'How to practice your coding skills',
		slug: 'how-to-practice-your-coding-skills',
		meta: 'Contrar',
		tags: ['programming'],
		thumbnail:
			'https://res.cloudinary.com/dbdlhupgj/image/upload/v1722457541/dev-blogs/gjuzc1o7x3ytwkmkthn7.jpg',
		createdAt: 'Tue Oct 11 2022 14:58:49 GMT+0530 (India Standard Time)',
	},
	{
		title: 'How to practice your coding skills',
		slug: 'how-to-practice-your-coding-skills',
		meta: 'Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making',
		tags: [],
		thumbnail: '',

		createdAt: 'Tue Oct 11 2022 14:58:49 GMT+0530 (India Standard Time)',
	},
]

const Posts: NextPage<IAdmin> = () => {
	const [postsToRender, setPostsToRender] = useState(posts)
	return (
		<AdminLayout>
			<div className='max-w-4xl mx-auto p-3'>
				<div className='grid grid-cols-3 gap-4'>
					{postsToRender.map(post => (
						<PostCard key={post.slug} post={post} />
					))}
				</div>
			</div>
		</AdminLayout>
	)
}

export default Posts
