"use client";

import { Fragment, useState, useEffect } from "react";
import Link from 'next/link';
import Image from 'next/image';
import { time } from "../../_utils/time";
import type { AdminPost } from "@/app/_types/AdminPost";
import { Sideber } from "@/app/_components/Sideber";
import { CategoriesIndexResponse } from "@/app/api/admin/categories/route";
import { useSupabaseSession } from '@/app/_hooks/useSupabaseSession';



export default function ShowPost() {
  const { token } = useSupabaseSession()

  const [posts, setPosts] = useState<AdminPost[]>([]);
  const [load, setLoad] = useState<boolean>(true);


  useEffect(() => {
    if (!token) return

    const fetcher = async () => {
      try {
        const res = await fetch('/api/admin/posts', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: token,
          },
        })
        const { posts }: CategoriesIndexResponse = await res.json()
        setPosts(posts)
        console.log(posts)
        setLoad(!load)

      } catch (error) {
        console.log(error)
        alert('投稿の取得に失敗しました。')
      }
    }

    fetcher()

  }, [token])


  if (load) {
    return <div className="mx-auto text-center mt-5">記事読み込み中！！！</div>
  } else if (posts.length === 0) {
    return
    <div className="mx-auto text-center mt-5">記事が見つかりません</div>
  };

  return (

    <div className="flex gap-6">
      <Sideber />

      <main className="flex-1 justify-between mx-auto container items-center">

        <div className="flex justify-between left-auto container">
          <span className="text-2xl justify-between m-4 text-left font-bold">記事一覧</span>
          <Link href='/admin/posts/new' className="text-2xl justify-between m-5 text-left bg-blue-500 text-mist-50 rounded-2xl font-bold p-2">新規作成</Link>
        </div>

        {
          posts.map(elem => (
            <Fragment key={elem.id} >
              <Link href={`posts/${elem.id}`}>
                <div className="text-left items-center ml-10">
                  <h6 className="text-2xl font-bold">{elem.title}</h6>
                  <time className="text-gray-500" dateTime={elem.createdAt}>{time(new Date(elem.createdAt))}</time>
                </div>
              </Link>

              <hr className="m-3" />

            </Fragment>
          ))}
      </main>

    </div>
  );
}