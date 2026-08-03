"use client";

import { Fragment, useState, useEffect } from "react";
import Link from 'next/link';
import Image from 'next/image';
import { time } from "../../_utils/time";
import type { AdminPost } from "@/app/_types/AdminPost";
import { Sideber } from "@/app/_components/Sideber";
import { AdminCategory } from "@/app/_types/AdminCategory";
import { CategoriesIndexResponse } from "@/app/api/admin/categories/route";
import { useSupabaseSession } from '@/app/_hooks/useSupabaseSession';



export default function ShowCategories() {

  const { token } = useSupabaseSession()
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [load, setLoad] = useState<boolean>(true);


  useEffect(() => {
    if (!token) return
    try {
      const fetcher = async () => {
        const res: Response = await fetch('/api/admin/categories', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: token,
          },
        })
        const { categories }: CategoriesIndexResponse = await res.json()
        setCategories(categories)
        console.log(categories)
        setLoad(!load)
      }

      fetcher()
    }
    catch (error) {
      console.log(error)
      alert('カテゴリーの取得に失敗しました。')
    }
  }, [token])



  if (load) {
    return <div className="mx-auto text-center mt-5">記事読み込み中！！！</div>
  } else if (categories.length === 0) {
    return
    <div className="mx-auto text-center mt-5">記事が見つかりません</div>
  };

  return (


    <div className="flex gap-6">
      <Sideber />

      <main className="flex-1 justify-between mx-auto container items-center">

        <div className="flex justify-between left-auto mx-auto container items-center">
          <span className="text-2xl justify-between text-left m-4 font-bold">カテゴリー一覧</span>
          <Link href='/admin/categories/new' className="text-2xl justify-between text-left m-5 bg-blue-500 text-mist-50 rounded-2xl font-bold p-3">新規作成</Link>
        </div>

        {
          categories.map(elem => (
            <Fragment key={elem.id} >
              <Link href={`categories/${elem.id}`}>
                <div className="text-left items-center ml-10">
                  <h6 className="text-2xl font-bold">{elem.name}</h6>
                </div>
              </Link>

              <hr className="m-3" />

            </Fragment>
          ))}
      </main>

    </div>
  );

}