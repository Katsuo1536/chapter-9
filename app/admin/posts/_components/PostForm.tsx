import { useForm } from "react-hook-form";
import { Fragment, useState, useEffect, ChangeEvent } from "react";
import type { AdminCategory } from "@/app/_types/AdminCategory";
import { CategoriesIndexResponse } from "@/app/api/admin/categories/route";
import { supabase } from '@/app/_libs/supabase';
import { v4 as uuidv4 } from 'uuid';
import Image from 'next/image';
import { useSupabaseSession } from '@/app/_hooks/useSupabaseSession';
import { useFetch } from "@/app/_hooks/useFetch";


export type Data = {
  title: string,
  content: string,
  thumbnailImageKey: string,
  categories: number[]
}

const defaultValues: Data = {
  title: '',
  content: '',
  thumbnailImageKey: '',
  categories: []
};


interface Props {
  mode: 'new' | 'edit',
  values?: Data,
  onSubmit: (data: Data) => void
  onDelete?: () => void
}

export const PostForm = ({
  mode,
  values,
  onSubmit,
  onDelete
}: Props
) => {

  const { token } = useSupabaseSession()


  const [thumbnailImageKey, setThumbnailImageKey] = useState<string>('');

  const handleImageChange = async (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    if (!event.target.files || event.target.files.length == 0) {
      return
    }

    const file = event.target.files[0]

    const filePath = `private/${uuidv4()}`


    const { data, error } = await supabase.storage
      .from('post_thumbnail')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      })

    if (error) {
      alert(error.message)
      return
    }

    setThumbnailImageKey(data.path)

  }

  const [thumbnailUrl, setThumbnailUrl] = useState<null | string>(null)
  useEffect(() => {
    if (!thumbnailImageKey) return

    try {
      // アップロード時に取得した、thumbnailImageKeyを用いて画像のURLを取得
      const fetcher = async () => {
        const {
          data: { publicUrl },
        } = await supabase.storage
          .from('post_thumbnail')
          .getPublicUrl(thumbnailImageKey)

        setThumbnailUrl(publicUrl)
      }

      fetcher()
    } catch (error) {
      console.log(error)
      alert('URLの取得に失敗しました。')
    }
  }, [thumbnailImageKey])


  const { data } = useFetch('/api/admin/categories')

  const categories: AdminCategory[] = data ? data.categories : [];



  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<Data>({
    defaultValues,
    values,
  });



  return (
    <form className="flex-1 mx-auto mr-30"
      onSubmit={handleSubmit(onSubmit)}>

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
        <label htmlFor="thumbnailImageKey">サムネイルURL</label>
      </div>
      <div className="justify-center gap-20 mx-auto container items-center mt-1">
        <input type='file' id='thumbnailImageKey' className="border border-b-gray-700 rounded-2xl p-4 w-full"
          accept="image/*"
          {...register('thumbnailImageKey', {
            validate: (v) => v !== '' || 'サムネイルは必須です。',
            onChange: handleImageChange,
            onBlur: setValue('thumbnailImageKey', thumbnailImageKey),
          })}

          disabled={isSubmitting} />
        {thumbnailUrl && (
          <div className="mt-2">
            <Image
              src={thumbnailUrl}
              alt="thumbnail"
              width={400}
              height={400}
            />
          </div>
        )}
      </div>
      <div className="justify-center mx-auto container items-center text-red-500">{errors.thumbnailImageKey?.message}</div>



      <div className="justify-center gap-20 mx-auto container items-center mt-10 m-5">
        <label htmlFor="category">カテゴリー</label>
      </div>
      {
        categories.map(elem => (
          <Fragment key={elem.id}>
            <label className="px-4 py-2 rounded-2xl p-4 cursor-pointer border
                      bg-gray-100 text-black
                       has-[:checked]:bg-blue-300 has-[:checked]:text-white">
              <input
                className="border border-b-gray-700 rounded-2xl p-4 sr-only"
                type="checkbox"
                value={elem.id}
                {...register('categories', {
                  validate: (c) => c.length > 0 || 'カテゴリーは必須です。',
                })}
                disabled={isSubmitting} />
              {elem.name}
            </label>
          </Fragment>
        ))
      }


      <div className="justify-center mx-auto container items-center text-red-500">{errors.categories?.message}</div>


      <div className="justify-center gap-10 mx-auto container items-center mt-20">
        <button className="bg-gray-950 text-mist-50 rounded-2xl font-bold p-3 mr-5" type="submit" disabled={isSubmitting}>
          {mode == 'new' ? '作成' : '更新'}
        </button>

        {mode == 'edit' && (
          <button className="bg-gray-300 text-mist-900 rounded-2xl font-bold p-3" onClick={handleSubmit(onDelete)} disabled={isSubmitting}>
            削除</button>
        )}
      </div>

    </form>

  );
}


