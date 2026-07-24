import Link from 'next/link';

export const Sideber = () => {

  return (

    <aside className="sticky top-0 h-screen w-64 shrink-0 bg-gray-700 text-white p-5">
      <nav>
        <ul>
          <li>
            <Link href="/admin/posts" className="text-white text- 1.5xl">記事一覧</Link>
          </li>
          <li>
            <Link href="/admin/categories" className="text-white text-1.5xl">カテゴリー一覧</Link>
          </li>
        </ul>
      </nav>
    </aside>

  );
};