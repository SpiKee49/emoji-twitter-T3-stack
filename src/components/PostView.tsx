import React from "react";
import { type RouterOutputs } from "~/utils/api";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);
import Image from "next/image";

type PostWithUser = RouterOutputs["posts"]["getAll"][number];

const PostView = (props: PostWithUser) => {
  const { post, author } = props;
  return (
    <div key={post.id} className="flex gap-5 border-b border-slate-700 p-4">
      <Image
        src={author?.profilePic}
        alt="Profile image"
        className="h-10 w-10 rounded-full"
        width={40}
        height={40}
      />
      <div className="flex flex-col">
        <div className="flex text-xs font-bold text-slate-600">
          <span>{`@${author?.username} · ${dayjs(
            post.createdAt
          ).fromNow()}`}</span>
        </div>
        <div className="flex">
          <span className="text-2xl">{post.content}</span>
        </div>
      </div>
    </div>
  );
};

export default PostView;
