import axios from 'axios'
import { FC, ReactNode, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { PostDetail } from '../../utils/types'
import { nanoid } from 'nanoid'
import ConfirmModal from './ConfirmModal'
import PostCard from './PostCard'

interface IInfiniteScrollPosts {
	posts: PostDetail[]
	showControls?: boolean
	hasMore: boolean
	next(): void
	dataLength: number
	loader?: ReactNode
	 onPostRemoved(post: PostDetail): void
}

const InfiniteScrollPosts: FC<IInfiniteScrollPosts> = ({
	posts,
	showControls,
	hasMore,
	loader,
	next,
	dataLength,
	onPostRemoved
}): JSX.Element => {
	const [showConfirmModal, setShowConfirmModal] = useState(false)
	const [postToRemove, setPostToRemove] = useState<PostDetail | null>(null)
	const [removing, setRemoving] = useState(false)

	const handleOnDeleteClick = (post: PostDetail) => {
		setPostToRemove(post)
		setShowConfirmModal(true)
	}
	const handleDeleteCancel = () => {
		setShowConfirmModal(false)
	}
	const handleDeleteConfirm = async () => {
		// console.log(
		// 	'from InfiniteScrollPosts page , handleDeleteCancel function -',
		// 	postToRemove
		// )
		if (!postToRemove) return handleDeleteCancel()
		setShowConfirmModal(false)
		setRemoving(true)
		const { data } = await axios.delete(`/api/posts/${postToRemove.id}`)
		if(data.removed) onPostRemoved(postToRemove)

		setRemoving(false)
	}

	const defaultLoader = (
		<p className='p-3 text-secondary-dark opacity-50 text-center font-semibold text-xl animate-pulse'>
			Loading ...
		</p>
	)

	return (
		<>
			<InfiniteScroll
				dataLength={dataLength}
				next={next}
				hasMore={hasMore}
				loader={loader || defaultLoader}
				// endMessage={
				// 	<p style={{ textAlign: 'center' }}>
				// 		<b>Yay! You have seen it all </b>
				// 	</p>
				// }
			>
				<div className='max-w-4xl mx-auto p-3'>
					<div className='grid grid-cols-3 gap-4'>
						{posts.map((post, idx) => (
							<div key={nanoid()}>
								<p className='font-semibold absolute text-xl p-2 z-50'>{ idx+1}</p>
								<PostCard
									post={post}
									controls={showControls}
									onDeleteClick={() => handleOnDeleteClick(post)}
									busy={removing}
								/>
							</div>
						))}
					</div>
				</div>
			</InfiniteScroll>
			<ConfirmModal
				onClose={handleDeleteCancel}
				onCancel={handleDeleteCancel}
				onConfirm={handleDeleteConfirm}
				visible={showConfirmModal}
				title='Are U sure?'
				subTitle='This action permanently remove this post!'
			/>
		</>
	)
}

export default InfiniteScrollPosts
