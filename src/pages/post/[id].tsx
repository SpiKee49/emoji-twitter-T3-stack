import { createServerSideHelpers } from '@trpc/react-query/server'
import { type GetStaticPropsContext } from 'next'
import superjson from 'superjson'
import Head from 'next/head'
import { appRouter } from '~/server/api/root'
import { prisma } from '~/server/db'

export async function getStaticProps(
    context: GetStaticPropsContext<{ id: string }>
) {
    const helpers = createServerSideHelpers({
        router: appRouter,
        ctx: { prisma, currentUserId: null },
        transformer: superjson, // optional - adds superjson serialization
    })
    const slug = context.params?.id as string
    // prefetch `post.byId`
    await helpers.posts.byId.prefetch({ id })
    return {
        props: {
            trpcState: helpers.dehydrate(),
            id,
        },
        revalidate: 1,
    }
}

export default function PostPage() {
    return (
        <>
            <Head>
                <title>Post</title>
                <meta name="description" content="Post detail v" />
            </Head>
            <main className="flex h-screen justify-center">
                <div className="h-full w-full border-x border-slate-300 md:max-w-2xl">
                    Post Page
                </div>
            </main>
        </>
    )
}
