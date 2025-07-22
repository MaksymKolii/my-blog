import '@/styles/globals.css'
import { Session } from 'next-auth'
import { SessionProvider } from 'next-auth/react'
import type { AppProps } from 'next/app'
import Router from 'next/router'
import nProgress from 'nprogress'

interface Props {
  session?: Session | null
}

nProgress.configure({ showSpinner: false })
Router.events.on('routeChangeStart', () => nProgress.start())
Router.events.on('routeChangeComplete', () => nProgress.done())
Router.events.on('routeChangeError', () => nProgress.done())

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
