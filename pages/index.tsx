import InfiniteScrollPosts from '@/components/common/InfiniteScrollPosts'
import DefaultLayout from '@/components/layout/DefaultLayout'
import { formatPosts, readPostsFromDb } from '@/lib/utils'
import { filterPosts } from '@/utils/helper'
import { PostDetail, UserProfile } from '@/utils/types'
import axios from 'axios'
import { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next'
import { useSession } from 'next-auth/react'
import { Inter } from 'next/font/google'
import { useState } from 'react'

const inter = Inter({ subsets: ['latin'] })

type IProps = InferGetServerSidePropsType<typeof getServerSideProps>

const Home: NextPage<IProps> = ({ posts }) => {
	const [postsToRender, setPostsToRender] = useState(posts)
	const [hasMorePosts, setHasMorePosts] = useState(posts.length >= limit)
	const { data } = useSession()
	const profile = data?.user as UserProfile
	const isAdmin = profile && profile.role === 'admin'

	const fetchMorePosts = async () => {
		try {
			pageNumb++
			const { data } = await axios(
				//* if deleting 1 post will show total pages less by 1 every time
				//  `/api/posts?limit=${limit}&pageNumb=${pageNumb}`
				`/api/posts?limit=${limit}&skip=${postsToRender.length}`
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
				<InfiniteScrollPosts
					hasMore={hasMorePosts}
					posts={postsToRender}
					dataLength={postsToRender.length}
					next={fetchMorePosts}
					showControls={isAdmin}
					onPostRemoved={post => {
						setPostsToRender(filterPosts(postsToRender, post))
					}}
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
