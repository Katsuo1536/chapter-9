"use client";
import { Fragment, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Sideber } from "@/app/_components/Sideber";
import { AdminCategory } from "@/app/_types/AdminCategory";
import { useParams, useRouter } from 'next/navigation';



export default function PostEdit() {

  const router = useRouter();

  type Data = {
    name: string,
  }

  const [category, setCategory] = useState<AdminCategory>();
  const [load, setLoad] = useState<boolean>(true);

  const { id } = useParams<string>();


  useEffect(() => {
    const fetcher = async () => {
      const res = await fetch(`/api/admin/categories/${id}`, {
      })
      const { category } = await res.json()
      setCategory(category)
      console.log(category)
      setLoad(!load)
    }

    fetcher()

  }, [id])

  const defaultValues: Data = {
    name: '',
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues,
    values: category ? {
      name: category.name
    } : undefined,
  });


  const Update = async (data: Data) => {
    try {
      const res: Response = await fetch(`/api/admin/categories/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: data.name,
        })
      })

      alert('カテゴリー名を更新しました。')
    }
    catch {
      alert('カテゴリー名の更新に失敗しました。')
    }
  }

  const Delete = async (data: Data) => {
    try {
      const res: Response = await fetch(`/api/admin/categories/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: data.name,
        })
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


      <form className="flex-1 mx-auto mr-30"
        onSubmit={handleSubmit(Update)}>

        <div className="text-left mt-5 text-3xl font-bold">カテゴリー編集</div>

        <div className="item- mx-auto container mt-10">
          <label htmlFor="title">タイトル</label>
        </div>
        <div className=" mx-auto container mt-1">
          <input className="border border-b-gray-700 rounded-2xl p-4 w-full"
            {...register('name', {
              required: 'カテゴリー名は必須です。',
              maxLength: {
                value: 30,
                message: 'カテゴリー名は30文字以内で入力してください。'
              }
            })}
            disabled={isSubmitting} />
        </div>
        <div className="flex justify-center mx-auto container items-center text-red-500">{errors.name?.message}</div>

        <div className="justify-center gap-10 mx-auto container items-center mt-20">
          <button className="bg-gray-950 text-mist-50 rounded-2xl font-bold p-3 mr-5" type="submit" disabled={isSubmitting}>
            更新</button>
          <button className="bg-gray-300 text-mist-900 rounded-2xl font-bold p-3" onClick={handleSubmit(Delete)} disabled={isSubmitting}>
            削除</button>
        </div>

      </form>
    </div>
  );
};