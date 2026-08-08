"use client";
import { Sideber } from "@/app/_components/Sideber";
import { useRouter } from 'next/navigation';
import { PostOfType } from "@/app/api/admin/posts/route";
import { PostForm, Data } from "../_components/PostForm";
import { useSupabaseSession } from '@/app/_hooks/useSupabaseSession';


export default function NewPost() {

  const { token } = useSupabaseSession()
  const router = useRouter();

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