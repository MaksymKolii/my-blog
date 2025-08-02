import { NextPage } from 'next'

import AdminLayout from '@/components/layout/AdminLayout'
import ContentWrapper from '@/components/admin/ContentWrapper'
import LatestPostListCard from '@/components/admin/LatestPostListCard'
import LatestCommentListCard from '@/components/admin/LatestCommentListCard'

interface IAdmin {}

const Admin: NextPage<IAdmin> = () => {
  return (
    <AdminLayout>
      <div className="flex space-x-10">
        <ContentWrapper seeAllRoute="/admin" title="Latest Posts">
          <LatestPostListCard
            title="This is my Title"
            slug="this-is-slug"
            meta="Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum adipisci ea iste similique doloremque sed eligendi repellat ratione, rem incidunt ex! Animi doloremque voluptatum qui placeat velit, dignissimos accusamus sunt ad, culpa illo eaque dolorum incidunt magnam beatae quam inventore necessitatibus laborum veritatis amet accusantium dicta repudiandae delectus voluptatibus! Maiores laudantium vitae soluta at sequi laboriosam aliquam quia eaque eligendi voluptatibus recusandae molestias nesciunt, perferendis dolore dolorem ducimus hic veritatis sunt tempore itaque odit voluptate accusantium quos aspernatur. Quaerat ratione aspernatur ad voluptates dignissimos autem temporibus nisi repellendus fugiat similique alias eveniet nihil ducimus placeat officia eaque tempore voluptatem quasi, quo veniam beatae eos. Cupiditate numquam porro obcaecati quae autem voluptates, fugit soluta odio qui sit explicabo iure atque eos quaerat fugiat provident, natus nam impedit eius dolorem! Voluptas culpa, aperiam minus quidem fuga ducimus enim, neque veritatis esse perspiciatis provident cum accusantium? Sequi dolorum similique eligendi velit molestiae nihil? Sunt nemo veniam sequi atque tenetur doloremque, neque obcaecati dolores asperiores vero perspiciatis quaerat deserunt, a blanditiis omnis rerum similique. Ex ea eaque debitis perspiciatis placeat et, error, id dignissimos ducimus tenetur magnam doloribus tempora. Iure odit perspiciatis quod error? Excepturi, ipsum neque! Voluptate nihil, amet facilis officiis ea dicta!"
          />
        </ContentWrapper>
        <ContentWrapper seeAllRoute="/admin" title="Latest Comments">
          <LatestCommentListCard
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
          />
        </ContentWrapper>
      </div>
    </AdminLayout>
  )
}

export default Admin
