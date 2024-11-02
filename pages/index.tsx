
import InfiniteScrollPosts from '@/components/common/InfiniteScrollPosts'
import DefaultLayout from '@/components/layout/DefaultLayout'
import { formatPosts, readPostsFromDb } from '@/lib/utils'
import { PostDetail } from '@/utils/types'
import axios from 'axios'
import { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next'
import { Inter } from 'next/font/google'
import { useState } from 'react'

const inter = Inter({ subsets: ['latin'] })

type IProps = InferGetServerSidePropsType<typeof getServerSideProps>

const Home: NextPage<IProps> = ({ posts }) => {
	const [postsToRender, setPostsToRender] = useState(posts)
	const [hasMorePosts, setHasMorePosts] = useState(true)

	const isAdmin =false

const fetchMorePosts = async () => {
	try {
		pageNumb++
		const { data } = await axios(
			`/api/posts?limit=${limit}&pageNumb=${pageNumb}`
		)
		if (data.posts.length < limit) {
			setPostsToRender([...postsToRender, ...data.posts])
			setHasMorePosts(false)
		} else setPostsToRender([...postsToRender, ...data.posts])
	} catch (error) {
		setHasMorePosts(false)
		console.log(error)
	}
}

	return (
		<DefaultLayout>
			<div className='pb-20'>
				{' '}
				<InfiniteScrollPosts
					hasMore={hasMorePosts}
					posts={postsToRender}
					dataLength={postsToRender.length}
					next={fetchMorePosts}
					showControls={isAdmin}
				/>
			</div>
		</DefaultLayout>
	)
}

export default Home
interface ServerSideResponse {
	posts: PostDetail[]
}

const limit = 9
let pageNumb = 0
export const getServerSideProps: GetServerSideProps<
	ServerSideResponse
> = async () => {
	try {
		// read posts
		const posts = await readPostsFromDb(limit, pageNumb)
		const formattedPosts = formatPosts(posts)
		// format posts
		return {
			props: {
				posts: formattedPosts,
			},
		}
	} catch (error) {
		return { notFound: true }
	}
}