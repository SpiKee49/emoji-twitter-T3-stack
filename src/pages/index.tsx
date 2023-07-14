import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";

import Head from "next/head";
import { api } from "~/utils/api";

export default function Home() {
  const { data } = api.posts.getAll.useQuery();
  const user = useUser();
  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          {!user.isSignedIn && (
            <SignInButton>
              <button className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20">
                Sign In
              </button>
            </SignInButton>
          )}
          {!!user.isSignedIn && (
            <SignOutButton>
              <button className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white underline hover:bg-white/20">
                Sign Out
              </button>
            </SignOutButton>
          )}
        </div>
        <div>
          {data?.map((post) => (
            <div key={post.id}>{post.content}</div>
          ))}
        </div>
      </main>
    </>
  );
}
