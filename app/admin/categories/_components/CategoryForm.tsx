import { useForm } from "react-hook-form";

export type Data = {
  name: string
}

type Props = {
  mode: 'new' | 'edit'
  values?: Data
  onSubmit: (data: Data) => void
  onDelete?: () => void
};

const defaultValues: Data = {
  name: ''
}

export const CategoryForm = ({
  mode,
  values,
  onSubmit,
  onDelete
}: Props
) => {

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<Data>({
    defaultValues,
    values,
  });


  return (
    <form className="flex-1 mx-auto mr-30"
      onSubmit={handleSubmit(onSubmit)}>

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
          {mode == 'new' ? '作成' : '更新'}</button>

        {mode == 'edit' && (
          <button className="bg-gray-300 text-mist-900 rounded-2xl font-bold p-3" onClick={handleSubmit(onDelete)} disabled={isSubmitting}>
            削除</button>
        )}
      </div>

    </form>
  );

}