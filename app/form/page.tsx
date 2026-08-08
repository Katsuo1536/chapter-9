"use client";
import { useForm } from "react-hook-form";

export default function Form() {

  type Data = {
    name: string,
    email: string,
    message: string
  }


  const Submit = async (data: Data) => {

    try {
      const res: Response = await fetch("https://1hmfpsvto6.execute-api.ap-northeast-1.amazonaws.com/dev/contacts", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          message: data.message
        })
      })

      alert('送信しました。')
      reset();
    }
    catch {
      alert('送信を失敗しました。')
    }

  }


  const defaultValues: Data = {
    name: '',
    email: '',
    message: ''
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({ defaultValues });


  return (

    <form className="mx-auto max-w-3xl px-4 mt-3"
      onSubmit={handleSubmit(Submit)}>

      <div className="mt-20 text-2xl font-bold">問い合わせフォーム</div>

      <div className="flex justify-center gap-35 mx-auto container items-center mt-10">
        <label htmlFor="name">お名前</label>
        <input className="border border-b-gray-700 rounded-2xl p-4 w-100"
          {...register('name', {
            required: 'お名前は必須です。',
            maxLength: {
              value: 30,
              message: 'お名前は30文字以内で入力してください。'
            }
          })}
          disabled={isSubmitting} />
      </div>
      <div className="flex justify-center mx-auto container items-center text-red-500">{errors.name?.message}</div>

      <div className="flex justify-center gap-20 mx-auto container items-center mt-5">
        <label htmlFor="email">メールアドレス</label>
        <input className="border border-b-gray-700 rounded-2xl mt-3 p-4 w-100"
          {...register('email', {
            required: 'メールアドレスは必須です。'
          })}
          disabled={isSubmitting} />
      </div>
      <div className="flex justify-center mx-auto container items-center text-red-500">{errors.email?.message}</div>


      <div className="flex justify-center gap-40 mx-auto container items-center">
        <label htmlFor="message">本文</label>
        <textarea
          className="border border-gray-700 rounded-2xl mt-10 p-4 w-100"
          color="30" rows={7}
          {...register('message', {
            required: '本文は必須です。',
            maxLength: {
              value: 500,
              message: '本文は、500字以内で入力してください。'
            }
          })}
          disabled={isSubmitting} />
      </div>
      <div className="flex justify-center mx-auto container items-center text-red-500">{errors.message?.message}</div>


      <div className="flex justify-center gap-10 mx-auto container items-center mt-20">
        <button className="bg-gray-950 text-mist-50 rounded-2xl font-bold p-3" type="submit" disabled={isSubmitting}>
          送信</button>
        <button className="bg-gray-300 text-mist-900 rounded-2xl font-bold p-3" type="reset" disabled={isSubmitting}>
          クリア</button>
      </div>

    </form>
  );


};