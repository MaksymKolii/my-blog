import DefaultLayout from '@/components/layout/DefaultLayout'
import dbConnect from '@/lib/dbConnect'
import Post from '@/models/Post'
import {
  GetStaticPaths,
  GetStaticProps,
  InferGetStaticPropsType,
  NextPage,
} from 'next'
import parse from 'html-react-parser'
import Image from 'next/image'
import dateFormat from 'dateformat'
import Comments from '@/components/common/Comments'
import LikeHeart from '@/components/common/LikeHeart'
import { useCallback, useState } from 'react'
import { boolean } from 'joi'

type ISinglePost = InferGetStaticPropsType<typeof getStaticProps>

const SinglePost: NextPage<ISinglePost> = ({ post }) => {

  const[likes, setLikes]=useState({likedByOwner:false, count:0})
  const { id, title, content, meta, tags, slug, thumbnail, createdAt } = post

const getLikedLabel= useCallback((): string=>{

const {likedByOwner,count}=likes

if(likedByOwner&& count===1) return 'You liked this Post !'
if(likedByOwner) return `You and ${count-1}other people liked this Post !`
if(count===0) return 'Like this Post !'
return count +' people liked this Post !'

},[likes])

  return (
    <DefaultLayout title={title} desc={meta}>
      <div>
        {thumbnail ? (
          <div className="relative aspect-video">
            <Image src={thumbnail} alt={title} fill priority />
          </div>
        ) : null}
        <h1 className="text-6xl font-semibold text-primary-dark dark:text-primary py-3">
          {title}
        </h1>
        <div className="flex items-center justify-between py-2 text-sm text-primary-dark dark:text-primary">
          <div className="space-x-4">
            {tags.map((t, idx) => (
              <span key={idx + t}>#{t}</span>
            ))}
          </div>
          <span>{dateFormat(createdAt, 'd-mmm-yyyy')}</span>
        </div>

        <div className=" prose prose-lg dark:prose-invert max-w-full mx-auto  ">
          {parse(content)}
        </div>
        <div className="py-10">
          <LikeHeart label={getLikedLabel()} />
        </div>
        {/*  comment form */}
        <Comments  belongsTo={id} />
      </div>
    </DefaultLayout>
  )
}

export default SinglePost

export const getStaticPaths: GetStaticPaths = async () => {
  try {
    await dbConnect()
    const posts = await Post.find().select('slug')
    const paths = posts.map(({ slug }) => ({ params: { slug: slug } }))
    return {
      paths,
      fallback: 'blocking',
    }
  } catch (error) {
    return { paths: [{ params: { slug: '/' } }], fallback: false }
  }
}
interface StaticPropsResponse {
  post: {
    id: string
    title: string
    content: string
    meta: string
    tags: string[]
    slug: string
    thumbnail: string
    createdAt: string
  }
}

export const getStaticProps: GetStaticProps<
  StaticPropsResponse,
  { slug: string }
> = async ({ params }) => {
  try {
    await dbConnect()
    const post = await Post.findOne({ slug: params?.slug })
    if (!post) return { notFound: true }
    const { _id, title, content, meta, tags, slug, thumbnail, createdAt } = post

    return {
      props: {
        post: {
          id: _id.toString(),
          title,
          content,
          meta,
          tags,
          slug,
          thumbnail: thumbnail?.url || '',
          createdAt: createdAt.toString(),
        },
      },
      revalidate: 60,
    }
  } catch (error) {
    return { notFound: true }
  }
}
