'use client'

import Link from 'next/link';
import { usePathname } from 'next/navigation'
import { useRouteGuard } from './../_hooks/useRouteGuard'

export const Sideber = () => {

  useRouteGuard()

  const pathname = usePathname()
  const isSelected = (href: string) => {
    return pathname.includes(href)
  }

  return (
    <>

      <aside className="sticky top-0 h-screen w-64 shrink-0 bg-gray-700 text-white p-5">
          <Link href="/admin/posts" className={`p-4 block hover:bg-blue-100 
                ${isSelected('/admin/posts') && 'bg-blue-50 text-black'}`}>記事一覧</Link>
          <Link href="/admin/categories" className={`p-4 block hover:bg-blue-100
                ${isSelected('/admin/categories') && 'bg-blue-50 text-black'}`}>カテゴリー一覧</Link>
      </aside>
    </>

  );
};