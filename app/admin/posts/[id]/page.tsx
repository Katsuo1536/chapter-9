"use client";
import { Fragment, useState, useEffect } from "react";
import { Sideber } from "@/app/_components/Sideber";
import type { AdminPost } from "@/app/_types/AdminPost";
import { useParams, useRouter } from 'next/navigation';
import { PostResponse, UpdateOfType } from "@/app/api/posts/[id]/route";
import { PostForm, Data } from "../_components/PostForm";


export default function PostEdit() {

  const router = useRouter();

  const [post, setPost] = useState<AdminPost>();
  const [load, setLoad] = useState<boolean>(true);

  const { id } = useParams<string>();

  try {

    useEffect(() => {
      const fetcher = async () => {
        const res: Response = await fetch(`/api/admin/posts/${id}`, {
        })
        const { post }: PostResponse = await res.json()
        setPost(post)
        console.log(post)
        setLoad(!load)
      }

      fetcher()
    }, [id])

  } catch (error) {
    console.log(error)
    alert('投稿の取得に失敗しました。')
  }


  const PostUpdate = async (data: Data) => {

    try {

      const body: UpdateOfType = {
        title: data.title,
        content: data.content,
        thumbnailURL: data.thumbnailUrl,
        categories: data.categories.map(Number)
      }

      const res: Response = await fetch(`/api/admin/posts/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
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
    try {
      const res: Response = await fetch(`/api/admin/posts/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
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
          thumbnailUrl: post.thumbnailURL,
          categories: post.postCategories.map(c => String(c.categoryId))
        } : undefined}
        onSubmit={PostUpdate}
        onDelete={PostDelete}
      />
    </div>
  );
};