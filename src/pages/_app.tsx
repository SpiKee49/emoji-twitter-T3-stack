import { type AppType } from 'next/app'
import { api } from '~/utils/api'
import '~/styles/globals.css'

import { ClerkProvider } from '@clerk/nextjs'
import type { AppProps } from 'next/app'
import { Toaster } from 'react-hot-toast'
import Head from 'next/head'

const MyApp: AppType = ({ Component, pageProps }: AppProps) => {
    return (
        <ClerkProvider {...pageProps}>
            <Head>
                <title>Vrabčiak</title>
                <meta name="description" content="Pay me or give me 💸" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Toaster />
            <Component {...pageProps} />
        </ClerkProvider>
    )
}

export default api.withTRPC(MyApp)
