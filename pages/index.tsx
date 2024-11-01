
import DefaultLayout from '@/components/layout/DefaultLayout'
import { NextPage } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

const Home: NextPage = () => {
	return <DefaultLayout>Home</DefaultLayout>
}

export default Home
