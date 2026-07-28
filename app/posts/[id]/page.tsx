"use client";

import { Fragment, useState, useEffect } from "react";
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { time } from "../../_utils/time";
import { AdminPost } from "@/app/_types/AdminPost";
import { PostResponse } from "@/app/api/posts/[id]/route";


export default function Article() {

  const { id } = useParams<string>();

  // const [post, setPost] = useState<Post | null>(null);
  const [post, setPost] = useState<AdminPost | null>(null);
  const [load, setLoad] = useState<boolean>(true);

  try {
    useEffect(() => {
      const fetcher = async () => {
        setLoad(true)
        const res = await fetch(
          `/api/posts/${id}`, {
        })
        const { post }: PostResponse = await res.json()
        setPost(post)
        console.log(post)
        setLoad(false)
      }

      fetcher()
    }, [id])
  }
  catch (error) {
    console.log(error)
    alert('投稿の取得に失敗しました。')
  }


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
        <Link href={`posts/${post.id}`}>
          <Fragment key={post.id} >
            <main className="mx-auto max-w-3xl px-4 m-20">
              {/* <div>
                <Image className="items-center"
                  src={post.thumbnail.url}
                  alt="post.thumbnailUrlの画像"
                  width={800}
                  height={400} /><br />
              </div> */}

              <div className="text-left">
                <time dateTime={post.createdAt}>{time(new Date(post.createdAt))}</time>



                <span>{post.postCategories.map(c => (
                  <span className="border border-blue-400 text-blue-400 rounded-2xl p-1 m-1" key='c.id'>{c.category.name}</span>
                ))}
                </span>


                <h6 className="text-3xl mt-2">{post.title}</h6>

                <div className="my-3 mb-20" dangerouslySetInnerHTML={{ __html: post.content }}></div>
              </div>

              {/* <Link href="/" className="text-blue-400" >記事一覧へ戻る</Link> */}
            </main>
          </Fragment>
        </Link>
      }
    </>
  );

}