import type { User } from '@clerk/nextjs/dist/types/server'

export const filterUsersForClient = (user: User) => {
    return {
        id: user.id,
        username: user.username,
        profilePic: user.profileImageUrl,
    }
}
