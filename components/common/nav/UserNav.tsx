import Link from 'next/link'
import { FC } from 'react'
import Logo from '../Logo'
import { APP_NAME } from '../AppHead'
import { HiLightBulb } from 'react-icons/hi'
import { GitHubAuthButton } from '@/components/button'
import ProfileHead from '../ProfileHead'
import DropdownOptions, { dropDownOptions } from '../DropdownOptions'



interface IUserNav {}

const UserNav: FC<IUserNav> = (props): JSX.Element => {
	const dropDownOptions: dropDownOptions = [
		{ label: "Dashboard", onClick() { } },
		{ label: "Logout", onClick() { } }
	]
	return (
		<div
			className='flex items-center justify-between bg-primary-dark p-3 
   
    
    '
		>
			{/* Logo */}
			<Link className='flex space-x-2 text-highlight-dark' href='/'>
				<Logo className='fill-highlight-dark' />
				<span className='text-xl font-semibold'>{APP_NAME}</span>
			</Link>
			<div className='flex items-center space-x-5'>
				<button className='dark:text-secondary-dark text-secondary-light'>
					<HiLightBulb className='text-secondary-light' size={34} />
				</button>
				{/* <GitHubAuthButton lightOnly /> */}

				<DropdownOptions
					options={dropDownOptions}
					head={<ProfileHead nameInitial='N' lightOnly />}
				/>
			</div>
		</div>
	)
}

export default UserNav
