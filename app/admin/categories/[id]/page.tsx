"use client";
import { Sideber } from "@/app/_components/Sideber";
import { AdminCategory } from "@/app/_types/AdminCategory";
import { useParams, useRouter } from 'next/navigation';
import { CategoryRequest, CategoryShowResponse } from "@/app/api/admin/categories/[id]/route";
import { CategoryForm, Data } from "../_components/CategoryForm";
import { useSupabaseSession } from '@/app/_hooks/useSupabaseSession';
import { useFetch } from "@/app/_hooks/useFetch";



export default function CategoryEdit() {

  const { token } = useSupabaseSession()
  const router = useRouter();

  const { id } = useParams<string>();


  const { data, isLoading, error } = useFetch(`/api/admin/categories/${id}`)

  const category: AdminCategory = data ? data.category : '';

  if (isLoading) {
    return <div className="mx-auto text-center mt-5">カテゴリー読み込み中！！！</div>
  }
  else if (error) {
    return
    <div className="mx-auto text-center mt-5">カテゴリーを取得できませんでした</div>
  };


  const CategoryUpdate = async (data: Data) => {
    if (!token) return
    try {

      const body: CategoryRequest = {
        name: data.name
      }

      const res: Response = await fetch(`/api/admin/categories/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify(body)
      })

      alert('カテゴリー名を更新しました。')
    }
    catch {
      alert('カテゴリー名の更新に失敗しました。')
    }
  }

  const CategoryDelete = async () => {
    if (!token) return
    try {
      const res: Response = await fetch(`/api/admin/categories/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      })

      alert('カテゴリーを削除しました。')
      router.push('/admin/categories')
    }
    catch {
      alert('カテゴリーの削除に失敗しました。')
    }

  }


  return (
    <div className="flex gap-20">
      <Sideber />

      <CategoryForm
        mode='edit'
        values={category ? {
          name: category.name
        } : undefined}
        onSubmit={CategoryUpdate}
        onDelete={CategoryDelete}
      />

    </div>
  );
};