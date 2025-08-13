import { NextPage } from 'next'

import AdminLayout from '@/components/layout/AdminLayout'
import ContentWrapper from '@/components/admin/ContentWrapper'
import LatestPostListCard from '@/components/admin/LatestPostListCard'
import LatestCommentListCard from '@/components/admin/LatestCommentListCard'
import { useState, useEffect } from 'react'
import { LatestComment, PostDetail } from '@/utils/types'
import axios from 'axios'
import { CanceledError } from 'axios' // axios@1
import LatestUserTable from '@/components/admin/LatestUserTable'
interface IAdmin {}

const Admin: NextPage<IAdmin> = () => {
  const [latestPosts, setLatestPosts] = useState<PostDetail[]>()
  const [latestComments, setLatestComments] = useState<LatestComment[]>()

  // useEffect(() => {
  //   //* Fetching latest posts
  //   axios('/api/posts?limit=5&skip=0').then(({data})=>{
  // setLatestPosts(data.posts)

  //   })
  //   .catch(err =>console.log('err:', err))
  //   //*  Fetching latest Comments
  //   axios('/api/comment/latest').then(({data})=>{
  // setLatestComments(data.comments)

  //   })
  //   .catch(err =>console.log('err:', err))

  // }, []);

  useEffect(() => {
    const controller = new AbortController()

    ;(async () => {
      try {
        const [postsRes, commentsRes] = await Promise.all([
          axios.get<{ posts: PostDetail[] }>('/api/posts', {
            params: { limit: 5, skip: 0 },
            signal: controller.signal,
          }),
          axios.get<{ comments: LatestComment[] }>('/api/comment/latest', {
            signal: controller.signal,
          }),
        ])

        // один проход setState → меньше лишних перерисовок
        setLatestPosts(postsRes.data.posts)
        setLatestComments(commentsRes.data.comments)
      } catch (err) {
        // игнорируем отменённый запрос (StrictMode вызывает эффект дважды в dev)
        if (err instanceof CanceledError) return
        console.error('Dashboard fetch failed:', err)
      }
    })()

    // отмена запросов на размонтирование/повторный вызов эффекта
    return () => controller.abort()
  }, [])
  return (
    <AdminLayout>
      <div className="flex space-x-10">
        <ContentWrapper seeAllRoute="/admin/posts" title="Latest Posts">
          {latestPosts?.map(({ title, meta, id, slug }) => {
            return (
              <LatestPostListCard
                key={id}
                title={title}
                slug={slug}
                meta={meta}
              />
            )
          })}
        </ContentWrapper>
        <ContentWrapper seeAllRoute="/admin" title="Latest Comments">
          {latestComments?.map((com) => {
            return <LatestCommentListCard comment={com} key={com.id} />
          })}

          {/* <LatestCommentListCard
            comment={{
              id: '636ccb908c8ae46fcf5e6eb0',
              owner: {
                id: '634d87f3dbde621e5cc300f9',
                name: 'Niraj Dhungana',
                avatar: 'https://avatars.githubusercontent.com/u/49363705?v=4',
              },
              content: '<p>This is mine Really</p>',
              belongsTo: {
                id: '634a54a00752a35cb01e3a18',
                title:
                  'This is how JS powers tracking user behavior and interaction on webpages',
                slug: 'this-is-how-js-powers-tracking-user-behavior-and-interaction-on-webpages',
              },
            }}
          /> */}
        </ContentWrapper>
      </div>

      {/* Latest Users */}
      <div className="max-w-[500px]">
        <ContentWrapper title="Latest Users" seeAllRoute="/admin/users">
          <LatestUserTable
            users={[
              {
                name: 'MadMax',
                id: '333',
                email: 'uh8g8g7@iiinhhh',
                provider: 'GitHub',
              },
            ]}
          />
        </ContentWrapper>
      </div>
    </AdminLayout>
  )
}

export default Admin
