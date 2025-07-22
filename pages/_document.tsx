import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* <link rel='icon' href='/favicon.ico' /> */}
        {/* Для других форматов иконок */}
        <link rel="icon" href="/favicon1.ico" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
