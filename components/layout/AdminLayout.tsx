import { FC, ReactNode } from 'react'
import AdminNav from '../common/AdminNav'
import { MdDashboardCustomize, MdContacts, MdPostAdd } from 'react-icons/md'
import { AiOutlineContainer } from 'react-icons/ai'
import { FaUsers } from 'react-icons/fa6'
import { FaComments } from 'react-icons/fa'
import { RiFileAddLine } from "react-icons/ri";

import Link from 'next/link'

interface IAdminLayout {
    children: ReactNode
    // className?: string;
}
const navItems = [
	{ href: '/admin', label: 'Dashboard', icon: MdDashboardCustomize },
	{ href: '/admin/posts', label: 'Posts', icon: AiOutlineContainer },
	{ href: '/admin/users', label: 'Users', icon: FaUsers },
	{ href: '/admin/comments', label: 'Comments', icon: FaComments },
	{ href: '/admin/contacts', label: 'Contacts', icon: MdContacts },
]

const AdminLayout: FC<IAdminLayout> = ({children}): JSX.Element => {
	return (
		<div className='flex'>
			<AdminNav navItem={navItems} />
            <div className="flex-1 p-4">{children}</div>
            {/* Create button */}
            <Link href='/admin/post/create' className= 'bg-secondary-dark dark:bg-secondary-light text-primary dark:text-primary-dark fixed z-50 right-10 bottom-10 p-3 rounded-full hover:scale-90 shadow-sm transition'><MdPostAdd size={24}/></Link>
            
		</div>
	)
}

export default AdminLayout
