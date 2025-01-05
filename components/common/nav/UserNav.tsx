import Link from 'next/link'
import { FC } from 'react'
import Logo from '../Logo'
import { APP_NAME } from '../AppHead'
import { HiLightBulb } from 'react-icons/hi'
import { GitHubAuthButton } from '@/components/button'
import ProfileHead from '../ProfileHead'
import DropdownOptions, { dropDownOptions } from '../DropdownOptions'
import { signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { UserProfile } from '@/utils/types'
import useDarkMode from '@/hooks/userDarkMode'

interface IUserNav {}
const defaultOptions: dropDownOptions = [
	{
		label: 'Logout',
		async onClick() {
			await signOut()
		},
	},
]

const UserNav: FC<IUserNav> = (props): JSX.Element => {
	const router = useRouter()
	const { data, status } = useSession()
	const isAuth = status === 'authenticated'
	const profile = data?.user as UserProfile | undefined
	const isAdmin = profile && profile.role === 'admin'

	// console.log('{ data, status } = useSession()', data, 'Status -', status)
	const {toggleTheme } =useDarkMode()

	// const handleLoginWithGithub = async () => {
	// 	await signIn('github')
	// }

	const dropDownOptions: dropDownOptions = isAdmin
		? [
				{
					label: 'Dashboard',
					onClick() {
						router.push('/admin')
					},
				},
				...defaultOptions,
		  ]
		: defaultOptions
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
				<button
					onClick={toggleTheme}
					className='dark:text-secondary-dark text-secondary-light'
				>
					<HiLightBulb className='text-secondary-light' size={34} />
				</button>
				{isAuth ? (
					<DropdownOptions
						options={dropDownOptions}
						head={<ProfileHead nameInitial='N' lightOnly />}
					/>
				) : (
					<GitHubAuthButton lightOnly />
				)}
			</div>
		</div>
	)
}

export default UserNav
