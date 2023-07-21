import { createTRPCRouter, publicProcedure } from '~/server/api/trpc'

import { TRPCError } from '@trpc/server'
import { clerkClient } from '@clerk/nextjs'
import { filterUsersForClient } from '~/server/helpers/filterUsersForClient'
import { z } from 'zod'

export const profileRouter = createTRPCRouter({
    getUserByUsername: publicProcedure
        .input(
            z.object({
                username: z.string(),
            })
        )
        .query(async ({ input }) => {
            const [user] = await clerkClient.users.getUserList({
                username: [input.username],
            })

            if (!user) {
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'User not found',
                })
            }

            return filterUsersForClient(user)
        }),
})
