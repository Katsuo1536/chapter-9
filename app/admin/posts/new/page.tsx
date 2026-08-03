"use client";
import { Fragment, useState, useEffect, use } from "react";
import { Sideber } from "@/app/_components/Sideber";
import type { AdminCategory } from "@/app/_types/AdminCategory";
import { useRouter } from 'next/navigation';
import { PostOfType } from "@/app/api/admin/posts/route";
import { CategoriesIndexResponse } from "@/app/api/admin/categories/route";
import { PostForm, Data } from "../_components/PostForm";
import { useSupabaseSession } from '@/app/_hooks/useSupabaseSession';


export default function NewPost() {

  const { token } = useSupabaseSession()
  const router = useRouter();

  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [load, setLoad] = useState<boolean>(true);

  useEffect(() => {
    if (!token) return
    try {
      const fetcher = async () => {
        const res = await fetch('/api/admin/categories', {
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
    } catch (error) {
      console.log(error)
      alert('カテゴリーの取得に失敗しました。')
    }
  }, [token])


  const MakePost = async (data: Data) => {
    if (!token) return
    try {

      const body: PostOfType = {
        title: data.title,
        content: data.content,
        thumbnailImageKey: data.thumbnailImageKey,
        categories: data.categories.map(Number),
      }

      const res: Response = await fetch('/api/admin/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify(body)
      })

      alert('記事を作成しました。')
      router.push('/admin/posts')
    }
    catch {
      alert('記事の作成に失敗しました。')
    }
  }


  return (
    <div className="flex gap-20">
      <Sideber />

      <PostForm
        mode='new'
        onSubmit={MakePost}
      />

    </div>
  );
};