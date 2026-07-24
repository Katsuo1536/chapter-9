"use client";
import { Fragment, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Sideber } from "@/app/_components/Sideber";
import type { AdminPost } from "@/app/_types/AdminPost";
import type { AdminCategory } from "@/app/_types/AdminCategory";
import { useParams, useRouter } from 'next/navigation';


export default function PostEdit() {

  const router = useRouter();


  type category = {
    id: number,
    name: string
  }

  type Data = {
    title: string,
    content: string,
    thumbnailUrl: string,
    categories: category[]
  }

  const [post, setPost] = useState<AdminPost>();
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [load, setLoad] = useState<boolean>(true);

  const { id } = useParams<string>();

  useEffect(() => {
    const fetcher = async () => {
      const res = await fetch(`/api/admin/posts/${id}`, {
      })
      const { post } = await res.json()
      setPost(post)
      console.log(post)
      setLoad(!load)
    }

    fetcher()
  }, [id])



  useEffect(() => {
    const fetcher = async () => {
      const res = await fetch('/api/admin/categories', {
      })
      const { categories } = await res.json()
      setCategories(categories)
      console.log(categories)
      setLoad(!load)
    }

    fetcher()
  }, [])


  const Update = async (data: Data) => {

    try {
      const res: Response = await fetch(`/api/admin/posts/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: data.title,
          content: data.content,
          thumbnailUrl: data.thumbnailUrl,
          categories: data.categories.map(Number)
        })
      })

      alert('記事を更新しました。')

    }
    catch {
      alert('記事の更新に失敗しました。')
    }
  }

  const Delete = async (data: Data) => {
    try {
      const res: Response = await fetch(`/api/admin/posts/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: data.title,
          content: data.content,
          thumbnailUrl: data.thumbnailUrl,
          categories: data.categories
        })
      })

      alert('記事を削除しました。')
      router.push('/admin/posts')
    }
    catch {
      alert('記事の削除に失敗しました。')
    }
  }

  const defaultValues: Data = {
    title: '',
    content: '',
    thumbnailUrl: '',
    categories: []
  };

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues,
    values: post ? {
      title: post.title,
      content: post.content,
      thumbnailUrl: post.thumbnailURL,
      categories: post.postCategories.map(c => String(c.categoryId))
    } : undefined,
  });
  
  //初期値の変化を確認
  // console.log(defaultValues);
  // console.log(watch("categories"))

  return (
    <div className="flex gap-20">
      <Sideber />

      <form className="flex-1 mx-auto mr-30"
        onSubmit={handleSubmit(Update)}>

        <div className="text-left mt-5 text-3xl font-bold">記事編集</div>

        <div className="item- mx-auto container mt-10">
          <label htmlFor="title">タイトル</label>
        </div>
        <div className=" mx-auto container mt-1">
          <input className="border border-b-gray-700 rounded-2xl p-4 w-full"
            {...register('title', {
              required: 'タイトルは必須です。',
              maxLength: {
                value: 30,
                message: 'お名前は30文字以内で入力してください。'
              }
            })}
            disabled={isSubmitting} />
        </div>
        <div className="flex justify-center mx-auto container items-center text-red-500">{errors.title?.message}</div>


        <div className="justify-center gap-40 mx-auto container items-center mt-10">
          <label htmlFor="content">内容</label>
        </div>
        <div className="justify-center gap-40 mx-auto container items-center mt-1">
          <textarea
            className="border border-gray-700 rounded-2xl p-4 w-full"
            color="30" rows={7}
            {...register('content', {
              required: '本文は必須です。',
              maxLength: {
                value: 500,
                message: '本文は、500字以内で入力してください。'
              }
            })}
            disabled={isSubmitting} />
        </div>
        <div className="justify-center mx-auto container items-center text-red-500">{errors.content?.message}</div>


        <div className="justify-center gap-20 mx-auto container items-center mt-5">
          <label htmlFor="thumbnailUrl">サムネイルURL</label>
        </div>
        <div className="justify-center gap-20 mx-auto container items-center mt-1">
          <input className="border border-b-gray-700 rounded-2xl p-4 w-full"
            {...register('thumbnailUrl', {
              required: '内容は必須です。'
            })}
            disabled={isSubmitting} />
        </div>
        <div className="justify-center mx-auto container items-center text-red-500">{errors.thumbnailUrl?.message}</div>

        <div className="justify-center gap-20 mx-auto container items-center mt-10 m-5">
          <label htmlFor="category">カテゴリー</label>
        </div>

        {
          categories?.map(elem => (
            <Fragment key={elem.id}>
              <label className="px-4 py-2 rounded-2xl p-4 cursor-pointer border
                      bg-gray-100 text-black
                       has-[:checked]:bg-blue-300 has-[:checked]:text-white">
                <input
                  className="border border-b-gray-700 rounded-2xl p-4 sr-only"
                  type="checkbox"
                  value={elem.id}
                  {...register('categories')}
                  disabled={isSubmitting} />
                {elem.name}
              </label>

            </Fragment>
          ))
        }


        <div className="justify-center mx-auto container items-center text-red-500">{errors.categories?.message}</div>


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