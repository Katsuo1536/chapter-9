"use client";

import { Fragment } from "react";
import Link from 'next/link';
import { Sideber } from "@/app/_components/Sideber";
import { CategoriesIndexResponse } from "@/app/api/admin/categories/route";
import { useFetch } from "@/app/_hooks/useFetch";
import type { AdminCategory } from "@/app/_types/AdminCategory";
import CategoryEdit from "./[id]/page";


export default function ShowCategories() {

  const { data, isLoading } = useFetch('/api/admin/categories')

  const categories : AdminCategory[] = data ? data.categories : [];

  if (isLoading) {
    return <div className="mx-auto text-center mt-5">カテゴリー読み込み中！！！</div>
  }
  else if (categories.length === 0) {
    return
    <div className="mx-auto text-center mt-5">カテゴリーが見つかりません</div>
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