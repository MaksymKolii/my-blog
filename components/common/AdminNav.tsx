import Link from 'next/link'
import { FC, useState } from 'react'
import Logo from './Logo'

import { ImMenu3, ImMenu4 } from 'react-icons/im'
import { IconType } from 'react-icons'

interface IAdminNavProps {
	navItem: {
		label: string
		icon: IconType
		href: string
	}[]
}

const AdminNav: FC<IAdminNavProps> = ({ navItem }): JSX.Element => {
	const [visible, setVisible] = useState(false)

	const updateNavState = () => {
		setVisible(!visible)
	}

	return (
		<nav className=' flex flex-col justify-between h-screen w-60 shadow-sm bg-secondary-light dark:bg-secondary-dark'>
			<div>
				<Link href='/admin' className='flex items-center space-x-2 p-3 mb-10'>
					<Logo className='fill-highlight-light dark:fill-highlight-dark w-5 h-5' />
					{visible && (
						<span className='text-highlight-light dark:text-highlight-dark text-xl font-semibold'>
							Admin
						</span>
					)}
				</Link>

				<div className='space-y-6'>
					{navItem &&
						navItem.map(item => {
							return (
								<Link
									key={item.href}
									href={item.href}
									className='flex items-center p-3 text-highlight-light dark:text-highlight-dark text-xl hover:font-semibold hover:scale-[0.98] hover:text-[#eb9b07] transition'
								>
									<item.icon size={24} />
									{visible && <span className='ml-2'>{item.label}</span>}
								</Link>
							)
						})}
				</div>
			</div>

			<button
				onClick={updateNavState}
				className='p-3 text-highlight-light dark:text-highlight-dark text-xl hover:font-semibold hover:scale-[0.94] hover:text-[#eb9b07] transition self-end'
			>
				{visible ? <ImMenu4 size={28} /> : <ImMenu3 size={28} />}

				<span className='sr-only'>Toggle Button</span>
			</button>
		</nav>
	)
}

export default AdminNav
