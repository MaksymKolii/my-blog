import { NextPage } from 'next'

import AdminLayout from '@/components/layout/AdminLayout'
import ContentWrapper from '@/components/admin/ContentWrapper'
import LatestPostListCard from '@/components/admin/LatestPostListCard'
import LatestCommentListCard from '@/components/admin/LatestCommentListCard'
import { useState, useEffect } from 'react'
import { LatestComment, PostDetail } from '@/utils/types'
import axios from 'axios'

interface IAdmin {}

const Admin: NextPage<IAdmin> = () => {

const [latestPosts, setLatestPosts] = useState<PostDetail[]>();
const [latestComments, setLatestComments] = useState<LatestComment[]>();

// const limit =5



useEffect(() => {
  //* Fetching latest posts
  axios('/api/posts?limit=5&skip=0').then(({data})=>{
setLatestPosts(data.posts)

  })
  .catch(err =>console.log('err:', err))
  //*  Fetching latest Comments
  axios('/api/comment/latest').then(({data})=>{
setLatestComments(data.comments)

  })
  .catch(err =>console.log('err:', err))
  
}, []);

  return (
    <AdminLayout>
      <div className="flex space-x-10">
        <ContentWrapper seeAllRoute="/admin" title="Latest Posts">
        {latestPosts?.map(({title,meta, id,slug})=>{
          return <LatestPostListCard key={id} title={title} slug={slug} meta={meta}/>
        })}
        </ContentWrapper>
        <ContentWrapper seeAllRoute="/admin" title="Latest Comments">
        {latestComments?.map((com)=>{
          return <LatestCommentListCard comment={com} key={com.id}/>
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
    </AdminLayout>
  )
}

export default Admin
