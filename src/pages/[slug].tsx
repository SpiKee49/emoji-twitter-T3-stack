import type {
    GetStaticPaths,
    GetStaticPropsContext,
    InferGetStaticPropsType,
} from 'next'

import Head from 'next/head'
import Image from 'next/image'
import PageLayout from '~/components/layout'
import { api } from '~/utils/api'
import { appRouter } from '~/server/api/root'
import { createServerSideHelpers } from '@trpc/react-query/server'
import { prisma } from '~/server/db'
import superjson from 'superjson'

export default function Profile(
    props: InferGetStaticPropsType<typeof getStaticProps>
) {
    const { data } = api.profile.getUserByUsername.useQuery({
        username: 'spikee49',
    })

    if (!data) return <div>404</div>

    console.log(data)

    return (
        <>
            <Head>
                <title>{data.username}</title>
                <meta name="description" content="User profile" />
            </Head>
            <PageLayout>
                <div className=" relative h-36 border-b border-slate-400 bg-gray-700">
                    <Image
                        src={data.profilePic}
                        alt={`${data.username ?? ''}'s profile picture`}
                        width={128}
                        height={128}
                        className="border-xl borde-4 absolute bottom-0 left-0 -mb-16 ml-4 rounded-full border-4 border-black"
                    />
                </div>
                <div className="flex h-16 flex-col justify-start "></div>
                <div className="p-5 text-2xl font-bold">@{data.username}</div>
                <div className="w-full border-b border-slate-400"></div>
            </PageLayout>
        </>
    )
}

export async function getStaticProps(
    context: GetStaticPropsContext<{ slug: string }>
) {
    const helpers = createServerSideHelpers({
        router: appRouter,
        ctx: { prisma, currentUserId: null },
        transformer: superjson, // optional - adds superjson serialization
    })
    const slug = context.params?.slug as string

    if (typeof slug !== 'string') throw new Error('no slug')
    const username = slug.replace('@', '')
    // prefetch `post.byId`
    await helpers.profile.getUserByUsername.prefetch({ username })

    return {
        props: {
            trpcState: helpers.dehydrate(),
            username,
        },
    }
}

export const getStaticPaths: GetStaticPaths = () => {
    return {
        paths: [],
        fallback: 'blocking',
    }
}
