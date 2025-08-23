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
import { useCallback, useEffect, useState } from 'react'
import useAuth from '@/hooks/useAuth'
import { signIn } from 'next-auth/react'
import axios from 'axios'

type ISinglePost = InferGetStaticPropsType<typeof getStaticProps>

const SinglePost: NextPage<ISinglePost> = ({ post }) => {
  const { id, title, content, meta, tags, slug, thumbnail, createdAt } = post

type LikesState = { likedByOwner: boolean; count: number }
const [likes, setLikes] = useState<LikesState>({ likedByOwner: false, count: 0 });

  const [busy, setBusy] = useState(false)

  const user = useAuth()

useEffect(() => {
  const controller = new AbortController()

  axios.get('/api/posts/like-status', {
    params: { postId: id },
    signal: controller.signal,
  })
  .then(({ data }) => {
    const n = Number(data?.newLikes ?? 0)   // ← НУЖНО newLikes
    setLikes({
      likedByOwner: !!data?.likedByOwner,
      count: Number.isFinite(n) ? n : 0,    // страховка от NaN
    })
  })
  .catch(err => {
    if (axios.isCancel?.(err)) return
    console.log(err)
  })

  return () => controller.abort()
}, [id])


//  useEffect(() => {
//      axios.get('/api/posts/like-status', {
//         params: { postId: id },
  
//       })
//       .then(({data})=>setLikes({likedByOwner: data.likedByOwner, count: data.likesCount}))
//       .catch(err=> console.log(err))
// }, [id]);

//   const getLikedLabel = useCallback(() => {
//   const { likedByOwner, count } = likes;
//   if (count === 0) return 'Like this Post!';
//   if (likedByOwner && count === 1) return 'You liked this post!';
//   if (likedByOwner) {
//     const others = count - 1;
//     return `You and ${others} other ${others === 1 ? 'person' : 'people'} liked this post!`;
//   }
//   return `${count} ${count === 1 ? 'person' : 'people'} liked this post!`;
// }, [likes]);
const getLikedLabel = useCallback(() => {
  const liked = !!likes.likedByOwner;
  const cRaw = likes.count;
  const c = Number.isFinite(cRaw) ? cRaw : 0;

  if (!liked) {
    if (c === 0) return 'Like this post!';
    return `${c} ${c === 1 ? 'person' : 'people'} liked this post!`;
  }

  // liked === true
  if (c <= 1) return 'You liked this post!';   // covers 0 and 1 safely
  const others = c - 1;
  return `You and ${others} other ${others === 1 ? 'person' : 'people'} liked this post!`;
}, [likes]);



  // 3) обработчик клика
  const handleOnLikeClick = async () => {
    try {
      if (!user) return await signIn('github')
      setBusy(true)
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
      setBusy(false)
    }
  }

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
          <LikeHeart
            liked={likes.likedByOwner}
            label={getLikedLabel()}
            onClick={handleOnLikeClick}
            busy={busy}
          />
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
