import AdminLayout from '@/components/layout/AdminLayout'
import { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next'
import { useState } from 'react'

import { PostDetail } from '@/utils/types'
import InfiniteScrollPosts from '@/components/common/InfiniteScrollPosts'
import { formatPosts, readPostsFromDb } from '@/lib/utils'
import axios from 'axios'

import { filterPosts } from '@/utils/helper'

type IProps = InferGetServerSidePropsType<typeof getServerSideProps>

const limit = 9
let pageNumb = 0

const Posts: NextPage<IProps> = ({ posts }) => {
  const [postsToRender, setPostsToRender] = useState(posts)
  const [hasMorePosts, setHasMorePosts] = useState(posts.length >= limit)

  const fetchMorePosts = async () => {
    try {
      pageNumb++
      const { data } = await axios(
        //* if deleting 1 post will show total pages less by 1 every time
        // `/api/posts?limit=${limit}&pageNumb=${pageNumb}`
        `/api/posts?limit=${limit}&skip=${postsToRender.length}`,
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
    <>
      <AdminLayout>
        <InfiniteScrollPosts
          hasMore={hasMorePosts}
          posts={postsToRender}
          dataLength={postsToRender.length}
          next={fetchMorePosts}
          showControls
          onPostRemoved={(post) => {
            setPostsToRender(filterPosts(postsToRender, post))
          }}
        />
      </AdminLayout>
      {/* <ConfirmModal   title='Are U sure?' subTitle='This action permanently remove this post!'/> */}
    </>
  )
}

interface ServerSideResponse {
  posts: PostDetail[]
}
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

export default Posts
