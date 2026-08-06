"use client";
import { Fragment, useState, useEffect } from "react";
import { Sideber } from "@/app/_components/Sideber";
import type { AdminPost } from "@/app/_types/AdminPost";
import { useParams, useRouter } from 'next/navigation';
import { PostResponse } from "@/app/api/posts/[id]/route";
import { PostForm, Data } from "../_components/PostForm";
import { useSupabaseSession } from '@/app/_hooks/useSupabaseSession';
import { UpdateOfType } from "@/app/api/admin/posts/[id]/route";



export default function PostEdit() {

  const { token } = useSupabaseSession()
  const router = useRouter();

  const [post, setPost] = useState<AdminPost>();
  const [load, setLoad] = useState<boolean>(true);

  const { id } = useParams<string>();

  useEffect(() => {
    if (!token) return

    const fetcher = async () => {
      try {
        const res: Response = await fetch(`/api/admin/posts/${id}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: token,
          },
        })
        const { post }: PostResponse = await res.json()
        setPost(post)
        console.log(post)
        setLoad(!load)

      } catch (error) {
        console.log(error)
        alert('投稿の取得に失敗しました。')
      }
    }

    fetcher()

  }, [id, token])



  const PostUpdate = async (data: Data) => {
    if (!token) return
    try {

      const body: UpdateOfType = {
        title: data.title,
        content: data.content,
        thumbnailImageKey: data.thumbnailImageKey,
        categories: data.categories.map(Number)
      }

      const res: Response = await fetch(`/api/admin/posts/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify(body)
      })


      alert('記事を更新しました。')

    }
    catch {
      alert('記事の更新に失敗しました。')
    }
  }

  const PostDelete = async () => {
    if (!token) return
    try {
      const res: Response = await fetch(`/api/admin/posts/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      })

      alert('記事を削除しました。')
      router.push('/admin/posts')
    }
    catch {
      alert('記事の削除に失敗しました。')
    }
  }


  return (
    <div className="flex gap-20">
      <Sideber />

      <PostForm
        mode='edit'
        values={post ? {
          title: post.title,
          content: post.content,
          thumbnailImageKey: post.thumbnailImageKey,
          categories: post.postCategories.map(c => String(c.CategoryId))
        } : undefined}
        onSubmit={PostUpdate}
        onDelete={PostDelete}
      />
    </div>
  );
};