import Link from 'next/link'
import { FC } from 'react'
import Logo from '../Logo'
import { APP_NAME } from '../AppHead'
import { HiLightBulb } from 'react-icons/hi'
import { GitHubAuthButton } from '@/components/button'
import ProfileHead from '../ProfileHead'
import DropdownOptions, { dropDownOptions } from '../DropdownOptions'
import { signIn, signOut, useSession } from 'next-auth/react'

interface IUserNav {}

const UserNav: FC<IUserNav> = (props): JSX.Element => {
	const { data, status } = useSession()
	console.log('{ data, status } = useSession()', data, 'Status -', status)
	const isAuth = status === 'authenticated'
	const handleLoginWithGithub = async () => {
		await signIn('github')
	}

	const dropDownOptions: dropDownOptions = [
		{ label: 'Dashboard', onClick() {} },
		{
			label: 'Logout',
			async onClick() {
				await signOut()
			},
		},
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
				{isAuth ? (
					<DropdownOptions
						options={dropDownOptions}
						head={<ProfileHead nameInitial='N' lightOnly />}
					/>
				) : (
					<GitHubAuthButton onClick={handleLoginWithGithub} lightOnly />
				)}
			</div>
		</div>
	)
}

export default UserNav
