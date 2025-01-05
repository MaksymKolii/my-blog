import { GitHubAuthButton } from '@/components/button'
import { NextPage } from 'next';

interface ISignin {}

const Signin: NextPage<ISignin> = () => {

   return (
			<div className='h-screen flex items-center justify-center bg-primary dark:bg-primary-dark'>
           <GitHubAuthButton
           />
			</div>
		)
};

export default Signin;