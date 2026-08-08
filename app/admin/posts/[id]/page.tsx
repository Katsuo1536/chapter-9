"use client";
import { Sideber } from "@/app/_components/Sideber";
import type { AdminPost } from "@/app/_types/AdminPost";
import { useParams, useRouter } from 'next/navigation';
import { PostForm, Data } from "../_components/PostForm";
import { useSupabaseSession } from '@/app/_hooks/useSupabaseSession';
import { UpdateOfType } from "@/app/api/admin/posts/[id]/route";
import { useFetch } from "@/app/_hooks/useFetch";



export default function PostEdit() {

  const { token } = useSupabaseSession()
  const router = useRouter();

  const { id } = useParams<string>();

  const { data, isLoading, error } = useFetch(`/api/admin/posts/${id}`)

  if (isLoading) {
    return <div className="mx-auto text-center mt-5">記事読み込み中！！！</div>
  }
  else if (error) {
    return
    <div className="mx-auto text-center mt-5">記事を取得できませんでした</div>
  };

  const post: AdminPost = data ? data.post : '';



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
          categories: post.postCategories.map(c => String(c.category.id))
        } : undefined}
        onSubmit={PostUpdate}
        onDelete={PostDelete}
      />
    </div>
  );
};