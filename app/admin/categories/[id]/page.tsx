"use client";
import { Fragment, useState, useEffect } from "react";
import { Sideber } from "@/app/_components/Sideber";
import { AdminCategory } from "@/app/_types/AdminCategory";
import { useParams, useRouter } from 'next/navigation';
import { CategoryRequest, CategoryShowResponse } from "@/app/api/admin/categories/[id]/route";
import { CategoryForm, Data } from "../_components/CategoryForm";



export default function CategoryEdit() {

  const router = useRouter();

  const [category, setCategory] = useState<AdminCategory>();
  const [load, setLoad] = useState<boolean>(true);

  const { id } = useParams<string>();


  try {
    useEffect(() => {
      const fetcher = async () => {
        const res = await fetch(`/api/admin/categories/${id}`, {
        })
        const { category }: CategoryShowResponse = await res.json()
        setCategory(category)
        console.log(category)
        setLoad(!load)
      }

      fetcher()

    }, [id])


  }
  catch (error) {
    console.log(error)
    alert('カテゴリーの取得に失敗しました。')
  }


  const CategoryUpdate = async (data: Data) => {
    try {

      const body: CategoryRequest = {
        name: data.name
      }

      const res: Response = await fetch(`/api/admin/categories/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
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
    try {
      const res: Response = await fetch(`/api/admin/categories/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
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