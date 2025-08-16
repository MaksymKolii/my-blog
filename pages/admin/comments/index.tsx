import Comments from '@/components/common/Comments';
import AdminLayout from '@/components/layout/AdminLayout';
import { NextPage } from 'next';

interface indexProps {
  
}

const AdminComments: NextPage<indexProps> = () => {
  return <AdminLayout>
    <Comments fetchAll/>
  </AdminLayout>;
};

export default AdminComments;