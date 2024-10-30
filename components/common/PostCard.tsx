import { PostDetail } from '@/utils/types'
import Image from 'next/image'
import { FC } from 'react'
import dateFormat, { masks } from 'dateformat'

interface IPostCard {
	post: PostDetail
}

const trimText = (text: string, trimBy: number):string => {
    if (text.length <= trimBy) return text
  return text.substring(0,trimBy).trim() + "..."
}

const PostCard: FC<IPostCard> = ({ post }): JSX.Element => {
	const { title, slug, meta, tags, thumbnail, createdAt } = post

	const formattedDate = dateFormat(createdAt, 'd-mmm-yyyy')
	return (
		<div className='rounded shadow-md shadow-secondary-dark overflow-hidden bg-primary dark:bg-primary-dark transition flex flex-col h-full'>
			{/* //*  thumbnail */}
			<div className='aspect-video relative'>
				{!thumbnail ? (
					<div className='w-full h-full flex items-center justify-center text-secondary-dark opacity-50 font-semibold'>
						No image
					</div>
				) : (
					<Image
						src={thumbnail}
						// layout='fill'
						width={500}
						height={300}
						alt='thumbnail'
					/>
				)}
			</div>

			{/* // * Post Info  */}
			<div className='p-2 flex-1 flex flex-col '>
				<div className='flex items-center justify-between text-sm text-primary-dark dark:text-primary mb-1'>
					<span>{formattedDate}</span>
					<p>Tags:</p>
				</div>
				<div className='flex items-center justify-between text-sm text-primary-dark dark:text-primary mb-3'>
					<div className='flex  space-x-1'>
						{tags &&
							tags.map((t, indx) => (
								<span
									className='bg-secondary-dark rounded-s-sm p-1'
									key={t + indx}
								>
									{indx === 0 ? `#${t}` : t}
									{indx < tags.length - 1 && ', '}{' '}
								</span>
							))}
					</div>
				</div>
				{/* </div> */}
				<h1 className='font-semibold text-primary-dark dark:text-primary mb-2'>
					{trimText(title, 45)}
				</h1>
				<p className=' text-secondary-dark'>{trimText(meta, 68)}</p>
				<div className='flex justify-end items-center space-x-4 mt-auto h-8 text-primary-dark dark:text-primary'>
					<button className='hover:underline'>Edit</button>
					<button className='hover:underline'>Delete</button>
				</div>
			</div>
		</div>
	)
}

export default PostCard
