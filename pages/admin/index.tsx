import { NextPage } from 'next'

import AdminLayout from '@/components/layout/AdminLayout'
import ContentWrapper from '@/components/admin/ContentWrapper'
import LatestPostListCard from '@/components/admin/LatestPostListCard'
import LatestCommentListCard from '@/components/admin/LatestCommentListCard'
import { useState, useEffect } from 'react'
import { LatestComment, LatestUserProfile, PostDetail } from '@/utils/types'
import axios from 'axios'
import { CanceledError } from 'axios' // axios@1
import LatestUserTable from '@/components/admin/LatestUserTable'
interface IAdmin {}

const Admin: NextPage<IAdmin> = () => {
  const [latestPosts, setLatestPosts] = useState<PostDetail[]>()
  const [latestComments, setLatestComments] = useState<LatestComment[]>()
  const [latestUsers, setLatestUsers] = useState<LatestUserProfile[]>()

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
        const [postsRes, commentsRes, usersRes] = await Promise.all([
            //  Fetching latest Posts
          axios.get<{ posts: PostDetail[] }>('/api/posts', {
            params: { limit: 5, skip: 0 },
            signal: controller.signal,
          }),
            //  Fetching latest Comments
          axios.get<{ comments: LatestComment[] }>('/api/comment/latest', {
            signal: controller.signal,
          }),
          //  Fetching latest Users
          axios.get<{ users: LatestUserProfile[] }>('/api/user', {
            signal: controller.signal,
          }),
        ])

        // один проход setState → меньше лишних перерисовок
        setLatestPosts(postsRes.data.posts)
        setLatestComments(commentsRes.data.comments)
        setLatestUsers(usersRes.data.users)
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
        <ContentWrapper seeAllRoute="/admin/comments" title="Latest Comments">
          {latestComments?.map((com) => {
            return <LatestCommentListCard comment={com} key={com.id} />
          })}

    
        </ContentWrapper>
      </div>

      {/* Latest Users */}
      <div className="max-w-[500px]">
        <ContentWrapper title="Latest Users" seeAllRoute="/admin/users">
          <LatestUserTable
            users={latestUsers}
          />
        </ContentWrapper>
      </div>
    </AdminLayout>
  )
}

export default Admin
