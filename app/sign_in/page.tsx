'use client'

import { supabase } from '@/app/_libs/supabase'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'

export type Data = {
  email: string,
  password: string
}

const defaultValues: Data = {
  email: '',
  password: ''
};


export default function Page() {

  const router = useRouter()

  const onSubmit = async (data: Data) => {


    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    })

    if (error) {
      alert('ログインに失敗しました')
    } else {
      router.replace('/admin/posts')
    }
  }


  const {
    register,
    handleSubmit,
    formState: { isLoading, errors }
  } = useForm<Data>({
    defaultValues
  });

  return (
    <div className="flex justify-center pt-60">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full max-w-100">
        <div>
          <label
            htmlFor="email"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            メールアドレス
          </label>
          <input
            type="email"
            id="email"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="name@company.com"
            {...register('email', {
              required: 'メールアドレスは必須です。',
            })}
            disabled={isLoading}
          />

          <div className="justify-center mx-auto container items-center text-red-500">{errors.email?.message}</div>

        </div>
        <div>
          <label
            htmlFor="password"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            パスワード
          </label>
          <input
            type="password"
            id="password"
            placeholder="••••••••"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            required
            {...register('password', {
              required: 'パスワードは必須です。',
            })}
            disabled={isLoading}
          />

          <div className="justify-center mx-auto container items-center text-red-500">{errors.password?.message}</div>

        </div>

        <div>
          <button
            type="submit"
            className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            disabled={isLoading}
          >
            ログイン
          </button>
        </div>
      </form>
    </div>
  )
}