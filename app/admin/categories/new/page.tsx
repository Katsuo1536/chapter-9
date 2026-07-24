"use client";
import { Fragment, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Sideber } from "@/app/_components/Sideber";
import type { AdminPost } from "@/app/_types/AdminPost";
import { useRouter } from 'next/navigation';



export default function PostEdit() {

    const router = useRouter();

  type Data = {
    name: string,
  }

  const defaultValues: Data = {
    name: '',
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<Data>({ defaultValues});


 const Post = async (data: Data) => {
    try {
      const res: Response = await fetch("/api/admin/categories", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: data.name,
        })
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


      <form className="flex-1 mx-auto mr-30"
        onSubmit={handleSubmit(Post)}>

        <div className="text-left mt-5 text-3xl font-bold">カテゴリー作成</div>

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
            作成</button>
        </div>

      </form>
    </div>
  );
};