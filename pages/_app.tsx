import '@/styles/globals.css'
import { Session } from 'next-auth'
import { SessionProvider } from 'next-auth/react'
import type { AppProps } from 'next/app'

interface Props {
	session?: Session | null
}

export default function App({
	Component,
	pageProps: { session, ...pageProps },
}: AppProps<Props>) {
  // console.log(session);
	return (
		<SessionProvider session={session}>

			<Component {...pageProps} />
		</SessionProvider>
	)
}
