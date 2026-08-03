'use client'

import Link from 'next/link';
import React, { use } from 'react'
import { useSupabaseSession } from '../_hooks/useSupabaseSession'
import { supabase } from '../_libs/supabase'
import { useRouter } from 'next/navigation'

export const Header: React.FC = () => {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut()
    await router.replace('/')
  }

  const { session, isLoading } = useSupabaseSession()

  return (

    <header className="bg-taupe-950">
      <nav className="flex justify-between mx-auto container items-center">
        <Link href="/" className="text-white text-2xl">Blog</Link>

        {(!isLoading) && (
          <div className="flex items-center gap-4">
            {session ? (
              <>
                <Link href="/admin" className="text-white text-1.5xl">
                  管理画面
                </Link>
                <button onClick={handleLogout} className='text-white text-1.5xl'>ログアウト</button>
              </>
            ) : (
              <>
                <Link href="/form" className="text-white text-1.5xl">
                  お問い合わせ
                </Link>

                <Link href="/sign_in" className="text-white text-1.5xl">
                  ログイン
                </Link>
              </>
            )
            }
          </div>
        )}
      </nav>
    </header>

  );
};