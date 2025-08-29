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
import { useCallback, useEffect, useMemo, useState } from 'react'
import useAuth from '@/hooks/useAuth'
import { signIn } from 'next-auth/react'
import axios from 'axios'
import User from '@/models/User'
import AuthorInfo from '@/components/common/AuthorInfo'
import Share from '@/components/common/Share'
import Link from 'next/link'

type ISinglePost = InferGetStaticPropsType<typeof getStaticProps>

type ViewAuthorProfile = {
  id: string
  name: string
  avatar: string
  message: string
  github?: string
}

const host ='https://my-blog-rho-tan-56.vercel.app'
// const host = process.env.NEXTAUTH_URL ?? 'http://localhost:3000'

const SinglePost: NextPage<ISinglePost> = ({ post }) => {
  const {
    id,
    title,
    content,
    meta,
    slug,
    tags,
    author,
    thumbnail,
    createdAt,
    relatedPosts,
  } = post
  // console.log('relatedPosts:', relatedPosts)
  type LikesState = { likedByOwner: boolean; count: number }
  const [likes, setLikes] = useState<LikesState>({
    likedByOwner: false,
    count: 0,
  })

  const [liking, setLiking] = useState(false)

  const user = useAuth()

  useEffect(() => {
    const controller = new AbortController()

    axios
      .get('/api/posts/like-status', {
        params: { postId: id },
        signal: controller.signal,
      })
      .then(({ data }) => {
        const n = Number(data?.newLikes ?? 0) // ← НУЖНО newLikes
        setLikes({
          likedByOwner: !!data?.likedByOwner,
          count: Number.isFinite(n) ? n : 0, // страховка от NaN
        })
      })
      .catch((err) => {
        if (axios.isCancel?.(err)) return
        console.log(err)
      })

    return () => controller.abort()
  }, [id])
  const getLikedLabel = useCallback(() => {
    const liked = !!likes.likedByOwner
    const cRaw = likes.count
    const c = Number.isFinite(cRaw) ? cRaw : 0

    if (!liked) {
      if (c === 0) return 'Like this post!'
      return `${c} ${c === 1 ? 'person' : 'people'} liked this post!`
    }

    // liked === true
    if (c <= 1) return 'You liked this post!' // covers 0 and 1 safely
    const others = c - 1
    return `You and ${others} other ${others === 1 ? 'person' : 'people'} liked this post!`
  }, [likes])

  // 3)

  const handleOnLikeClick = async () => {
    // double-click guard (на всякий случай, т.к. ты уже отключаешь onClick)
    if (liking) return
    if (!user) {
      await signIn('github')
      return
    }
    setLiking(true)
    try {
      const { data } = await axios.post(`/api/posts/update-like`, null, {
        params: { postId: id },
      })
      // берём ИСТИНУ с бэка
      setLikes({
        likedByOwner: !!data.likedByOwner,
        count: Number(data.newLikes ?? 0),
      })
    } catch (error) {
      console.error('update-like failed:', error)
    } finally {
      // setBusy(false)
      setLiking(false)
    }
  }

  const authorProfile = useMemo<ViewAuthorProfile>(() => {
    try {
      const raw = JSON.parse(author) as any
      return {
        id: String(raw?.id ?? ''),
        name: String(raw?.name ?? ''),
        avatar: typeof raw?.avatar === 'string' ? raw.avatar : '', // ← всегда string
        message: typeof raw?.message === 'string' ? raw.message : '',
        github: typeof raw?.github === 'string' ? raw.github : undefined,
      }
    } catch {
      return { id: '', name: '', avatar: '', message: '' }
    }
  }, [author])

  return (
    <DefaultLayout title={title} desc={meta}>
      <div className="lg:px-0 px-3">
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
        <div className="py-7 transition dark:bg-primary-dark bg-primary sticky top-0 z-50">
          <Share url={host + '/' + slug} />
        </div>

        <div className=" prose prose-lg dark:prose-invert max-w-full mx-auto  ">
          {parse(content)}
        </div>
        <div className="py-10">
          <LikeHeart
            liked={likes.likedByOwner}
            label={getLikedLabel()}
            onClick={!liking ? handleOnLikeClick : undefined}
            busy={liking}
          />
        </div>

        <div className="pt-10">
          <AuthorInfo profile={authorProfile} />
        </div>
        <div className="pt-5">
          <h3 className="text-xl rounded-sm font-semibold bg-secondary-dark p-2 text-primary mb-4">Related Posts: 

          </h3>
          <div className="flex flex-col space-y-4">{relatedPosts.map(p=>{
            return<Link className='font-semibold text-primary-dark dark:text-primary hover:underline' key={p.id + p.slug} href={p.slug}>{p.title}</Link>
          })}</div>
        </div>
        {/*  comment form */}
        <Comments belongsTo={id} />
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
    author: string
    relatedPosts: {
      id: string
      title: string
      slug: string
    }[]
  }
}

export const getStaticProps: GetStaticProps<
  StaticPropsResponse,
  { slug: string }
> = async ({ params }) => {
  try {
    await dbConnect()
    const post = await Post.findOne({ slug: params?.slug }).populate('author')
    if (!post) return { notFound: true }
    // Fetching related posts according to tags
    const posts = await Post.find({
      // tags:{$in: [...post.tags]},
      tags: { $in: post.tags ?? [] },
      _id: { $ne: post._id },
    })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('slug title')
      .lean()

    const relatedPosts = posts.map((p) => ({
      id: p._id.toString(),
      slug: p.slug,
      title: p.title,
    }))
    const {
      _id,
      title,
      content,
      meta,
      tags,
      slug,
      author,
      thumbnail,
      createdAt,
    } = post

    const admin = await User.findOne({ role: 'admin' })
    const authorInfo = (author || admin) as any

    const postAuthor = {
      id: String(authorInfo._id),
      name: String(authorInfo.name || ''),
      avatar: typeof authorInfo.avatar === 'string' ? authorInfo.avatar : '',
      message: `This post is written by ${authorInfo.name}. ${authorInfo.name.split(' ')[0]} is a full-stack JS developer. You can find him on`,
      github: 'https://github.com/maksymkolii',
    }

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
          author: JSON.stringify(postAuthor),
          relatedPosts,
        },
      },
      revalidate: 60,
    }
  } catch (error) {
    return { notFound: true }
  }
}
