import { GitHubAuthButton } from '@/components/button'
import { NextPage } from 'next';
import { signIn } from 'next-auth/react'

interface ISignin {}

const Signin: NextPage<ISignin> = () => {
    // const handleLoginWithGithub = async () => {
	// 		await signIn('github')
	// 	}
   return (
			<div className='h-screen flex items-center justify-center bg-primary dark:bg-primary-dark'>
           <GitHubAuthButton
            //    onClick={handleLoginWithGithub} lightOnly
           />
			</div>
		)
};

export default Signin;