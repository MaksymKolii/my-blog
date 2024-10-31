import { PostDetail } from '@/utils/types'
import Image from 'next/image'
import { FC } from 'react'
import dateFormat, { masks } from 'dateformat'
import Link from 'next/link'

interface IPostCard {
	post: PostDetail
	busy?: boolean
	onDeleteClick?(): void
}

const trimText = (text: string, trimBy: number): string => {
	if (text.length <= trimBy) return text
	return text.substring(0, trimBy).trim() + '...'
}

const PostCard: FC<IPostCard> = ({
	post,
	busy,
	onDeleteClick,
}): JSX.Element => {
	const { title, slug, meta, tags, thumbnail, createdAt } = post

	const formattedDate = dateFormat(createdAt, 'ddd, dd-mmm-yyyy,  HH:MM')
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
						sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
						
						width={500}
						height={300}
						alt='thumbnail'
						priority
					/>
				)}
			</div>

			{/* // * Post Info  */}
			<div className='p-2 flex-1 flex flex-col '>
				<Link href={'/' + slug}>
					<div className='flex items-center justify-between text-sm text-primary-dark dark:text-primary mb-1'>
						<span>{formattedDate}</span>
						<p>Tags:</p>
					</div>

					{/* Tags Display */}
					<div className='text-sm text-primary-dark dark:text-primary mb-3'>
						{/* First Row of Tags (up to 3) */}
						<div className='flex space-x-1'>
							{tags.slice(0, 4).map((t, indx) => (
								<span
									className='bg-secondary-dark rounded px-1 '
									key={`tag-${slug}-${t}-${indx}`}
								>
									{indx === 0 ? `#${t}` : t}
								</span>
							))}
						</div>

						{/* Second Row of Tags (from 4th tag onward) */}
						{tags.length > 4 && (
							<div className='flex mt-2 space-x-1'>
								{tags.slice(3).map((t, indx) => (
									<span
										className='bg-secondary-dark rounded p-1 '
										key={`post-${post.slug}-${indx}`}
									>
										{t}
									</span>
								))}
							</div>
						)}
					</div>

					<h1 className='font-semibold text-primary-dark dark:text-primary mb-2'>
						{trimText(title, 50)}
					</h1>
					<p className=' text-secondary-dark'>{trimText(meta, 70)}</p>
				</Link>
				<div className='flex justify-end items-center space-x-4 mt-auto h-8 text-primary-dark dark:text-primary'>
					{busy ? (
						<span className='animate-pulse'>Removing</span>
					) : (
						<>
							{' '}
							<Link
								className='hover:underline'
								href={'/admin/posts/update/' + slug}
							>
								Edit
							</Link>
							<button onClick={onDeleteClick} className='hover:underline'>
								Delete
							</button>
						</>
					)}
				</div>
			</div>
		</div>
	)
}
    

export default PostCard
