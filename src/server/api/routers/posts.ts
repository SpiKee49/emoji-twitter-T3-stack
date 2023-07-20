import {
    createTRPCRouter,
    privateProcedure,
    publicProcedure,
} from '~/server/api/trpc'

import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'
import { TRPCError } from '@trpc/server'
import type { User } from '@clerk/nextjs/dist/types/server'
import { clerkClient } from '@clerk/nextjs'
import { z } from 'zod'

const filterUsersForClient = (user: User) => {
    return {
        id: user.id,
        username: user.username,
        profilePic: user.profileImageUrl,
    }
}

// Create a new ratelimiter, that allows 3 requests per 1 minute
const ratelimit = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(3, '1 m'),
})

export const postsRouter = createTRPCRouter({
    getAll: publicProcedure.query(async ({ ctx }) => {
        const posts = await ctx.prisma.post.findMany({
            take: 100,
            orderBy: {
                createdAt: 'desc',
            },
        })

        const users = (
            await clerkClient.users.getUserList({
                userId: posts.map((post) => post.authorId),
                limit: 100,
            })
        ).map(filterUsersForClient)

        return posts.map((post) => {
            const author = users.find((user) => user.id === post.authorId)

            if (!author || !author.username)
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: `Author for the post-${post.id} not found`,
                })

            return {
                post,
                author: {
                    ...author,
                    username: author.username,
                },
            }
        })
    }),

    create: privateProcedure
        .input(
            z.object({
                content: z.string().emoji().min(1).max(280),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const authorId = ctx.currentUserId
            //rate limiting
            const { success } = await ratelimit.limit(authorId)
            if (!success) throw new TRPCError({ code: 'TOO_MANY_REQUESTS' })

            const post = await ctx.prisma.post.create({
                data: {
                    authorId,
                    content: input.content,
                },
            })

            return post
        }),
})
