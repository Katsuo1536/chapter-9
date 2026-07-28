"use client";
import { Sideber } from "@/app/_components/Sideber";
import { useRouter } from 'next/navigation';
import { PostCategoryRequest } from "@/app/api/admin/categories/route";
import { CategoryForm, Data } from "../_components/CategoryForm";



export default function NewCategory() {

  const router = useRouter();

  const CategoryPost = async (data: Data) => {
    try {

      const body: PostCategoryRequest = {
        name: data.name
      }

      const res: Response = await fetch("/api/admin/categories", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      })

      alert('カテゴリーを作成しました。')
      router.push('/admin/categories')
    }
    catch {
      alert('カテゴリーの作成に失敗しました。')
    }
  }


  return (
    <div className="flex gap-20">
      <Sideber />

      <CategoryForm
        mode='new'
        onSubmit={CategoryPost}
      />

    </div>
  );
};