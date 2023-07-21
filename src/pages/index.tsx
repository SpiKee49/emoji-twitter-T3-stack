import { SignInButton, useUser } from '@clerk/nextjs'

import Feed from '../components/Feed'
import Image from 'next/image'
import { LoadingSpinner } from '~/components/Loading'
import PageLayout from '~/components/layout'
import { api } from '~/utils/api'
import toast from 'react-hot-toast'
import { useState } from 'react'

const CreatePostWizard = () => {
    const { user } = useUser()
    const [input, setInput] = useState<string>('')

    const ctx = api.useContext()

    const { mutate, isLoading: posting } = api.posts.create.useMutation({
        onSuccess: () => {
            setInput('')
            void ctx.posts.getAll.invalidate()
        },
        onError: (e) => {
            const errMsg = e.data?.zodError?.fieldErrors.content
            if (errMsg && errMsg[0]) {
                toast.error(errMsg[0])
                return
            } else {
                toast.error('Failed to post! Please try again.')
            }
        },
    })

    if (!user) return null
    return (
        <div className="flex w-full gap-5">
            <Image
                src={user.profileImageUrl}
                alt="Profile image"
                className="h-10 w-10 rounded-full"
                width={40}
                height={40}
            />
            <input
                placeholder="Type some emojis!"
                className="w-full bg-transparent"
                type="text"
                value={input}
                disabled={posting}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                    e.preventDefault()
                    if (e.key === 'Enter') {
                        mutate({ content: input })
                    }
                }}
            />
            {input !== '' && !posting && (
                <button
                    onClick={() => mutate({ content: input })}
                    disabled={posting}
                >
                    Post
                </button>
            )}
            {posting && (
                <div className="flex items-center justify-center">
                    <LoadingSpinner size={20} />
                </div>
            )}
        </div>
    )
}

export default function Home() {
    const { isLoaded: userLoaded, isSignedIn } = useUser()

    if (!userLoaded) return <div />

    // React Query is using cache, so even tho we don't store data here but in component Feed, they will be prepared in cache
    api.posts.getAll.useQuery()

    return (
        <PageLayout>
            <div className="flex border-b border-slate-500 p-4 ">
                {!isSignedIn && (
                    <div className="flex justify-center">
                        <SignInButton>
                            <button className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20">
                                Sign In
                            </button>
                        </SignInButton>
                    </div>
                )}
                {isSignedIn && <CreatePostWizard />}
            </div>
            <Feed />
        </PageLayout>
    )
}
