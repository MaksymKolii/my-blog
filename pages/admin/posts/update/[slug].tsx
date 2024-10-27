import { FinalPost } from '@/components/editor'
import dbConnect from '@/lib/dbConnect'
import Post from '@/models/post'
import { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next'

interface PostResponse extends FinalPost {
	id: string
}

type IUpdate = InferGetServerSidePropsType<typeof getServerSideProps>

interface ServerSideResponse {
	post: PostResponse
}

const Update: NextPage<IUpdate> = ({ post }) => {
	return <div className=''>Update</div>
}

export const getServerSideProps: GetServerSideProps<
	ServerSideResponse
> = async context => {
	const slug = context.query.slug as string
	// console.log('Context-=---=-=--===================================================1111111111111111',slug);
	await dbConnect()
	const post = await Post.findOne({ slug })
	if (!post) return { notFound: true }
	const { _id, title, content, tags, meta, thumbnail, id } = post
	return { props: { post: {} } }
}

export default Update
