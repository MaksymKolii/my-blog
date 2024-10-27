import { FC, ReactNode } from 'react'
import AdminNav from '../common/AdminNav'
import { MdDashboardCustomize, MdContacts, MdPostAdd } from 'react-icons/md'
import { AiOutlineContainer } from 'react-icons/ai'
import { FaUsers } from 'react-icons/fa6'
import { FaComments } from 'react-icons/fa'
import { RiFileAddLine } from 'react-icons/ri'

import Link from 'next/link'
import AppHead from '../common/AppHead'

interface IAdminLayout {
	children: ReactNode
	// className?: string;
	title?: string;
}
const navItems = [
	{ href: '/admin', label: 'Dashboard', icon: MdDashboardCustomize },
	{ href: '/admin/posts', label: 'Posts', icon: AiOutlineContainer },
	{ href: '/admin/users', label: 'Users', icon: FaUsers },
	{ href: '/admin/comments', label: 'Comments', icon: FaComments },
	{ href: '/admin/contacts', label: 'Contacts', icon: MdContacts },
]

const AdminLayout: FC<IAdminLayout> = ({title, children }): JSX.Element => {
	return (
		<>
			<AppHead title={title} />
			<div className='flex'>
				<AdminNav navItem={navItems} />
				<div className='flex-1 p-4'>{children}</div>
				{/* Create button */}
				<Link
					href='/admin/posts/create'
					className='bg-secondary-dark dark:bg-secondary-light text-primary dark:text-primary-dark fixed z-50 right-10 bottom-10 p-3 rounded-full hover:scale-90 shadow-sm transition'
				>
					<MdPostAdd size={24} />
				</Link>

{/* <Link legacyBehavior href="/admin/post/create">
          <a className="bg-secondary-dark dark:bg-secondary-light text-primary dark:text-primary-dark fixed z-10 right-10 bottom-10 p-3 rounded-full hover:scale-90 shadow-sm transition">
		  <MdPostAdd size={24} />
          </a>
        </Link> */}
			</div>
		</>
	)
}

export default AdminLayout
