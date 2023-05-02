import Header from '@/components/header'
import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body className='bg-gray-500'>
        <Header />
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
