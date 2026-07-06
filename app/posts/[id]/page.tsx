"use client";

import { Fragment, useState, useEffect } from "react";
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { time } from "../../_utils/time";
import { MicroCmsPost } from "@/app/_types/MicroCmsPost";

export default function Article() {

  const { id } = useParams<string>();

  // const [post, setPost] = useState<Post | null>(null);
  const [post, setPost] = useState<MicroCmsPost | null>(null);
  const [load, setLoad] = useState<boolean>(true);

  useEffect(() => {
    const fetcher = async () => {
      setLoad(true)
      const res = await fetch(
        `https://27ycqhtq1v.microcms.io/api/v1/posts/${id}`,
        {
          headers: {
            'X-MICROCMS-API-KEY': process.env.NEXT_PUBLIC_MICROCMS_API_KEY as string,
          },
        },
      )
      const data = await res.json()
      setPost(data) // dataをそのままセット
      setLoad(false)
    }

    fetcher()
  }, [id])


  if (load) {
    return <div className="mx-auto text-center mt-5">投稿読み込み中！！！</div>
  } else if (!post) {
    return <div>
      <div className="mx-auto text-center mt-5">投稿が見つかりません</div>
      <Link href="/" className="mx-auto text-blue-400 text-0xl" >記事一覧へ戻る</Link>
    </div>
  };



  return (
    <>
      {
        <Link href={`/posts/${post.id}`}>
          <Fragment key={post.id} >
            <main className="mx-auto max-w-3xl px-4 mt-3">
              <div>
                <Image className="items-center"
                  src={post.thumbnail.url}
                  alt="post.thumbnailUrlの画像"
                  width={800}
                  height={400} /><br />
              </div>

              <div className="text-left">
                <time dateTime={post.createdAt}>{time(new Date(post.createdAt))}</time>



                <span>{post.categories?.map(category => (
                  <span className="bg-gray-200 text-black rounded-2xl p-1" >{category.name}</span>
                ))}
                </span>


                <h6 className="text-3xl mt-2">{post.title}</h6>

                <div className="my-3" dangerouslySetInnerHTML={{ __html: post.content }}></div>
              </div>

              <Link href="/" className="text-blue-400" >記事一覧へ戻る</Link>
            </main>
          </Fragment>
        </Link>
      }
    </>
  );

}