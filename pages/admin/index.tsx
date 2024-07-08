import AdminNav from '@/components/common/AdminNav'
import { NextPage } from 'next';
import { MdDashboardCustomize, MdContacts } from 'react-icons/md'
import { AiOutlineContainer } from 'react-icons/ai'
import { FaUsers } from "react-icons/fa6";
import { FaComments } from "react-icons/fa";

const navItems=[
{href:'/admin',
   label: 'Dashboard',
   icon:MdDashboardCustomize
},
{href:'/admin/posts',
   label: 'Posts',
   icon:AiOutlineContainer 
},
{href:'/admin/users',
   label: 'Users',
   icon:FaUsers
},
{href:'/admin/comments',
   label: 'Comments',
   icon:FaComments
},
{href:'/admin/contacts',
   label: 'Contacts',
   icon:MdContacts
},

]

interface IAdmin {}

const Admin: NextPage<IAdmin> =()=>{
   return <div className=''><AdminNav navItem={navItems}/></div>;
};

export default Admin;

