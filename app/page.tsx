"use client";

import { Fragment } from "react";
import Link from 'next/link';
import Image from 'next/image';
import { time } from "./_utils/time";
import { AdminPost } from "./_types/AdminPost";
import { PostsIndexResponse } from "./api/posts/route";
import { useFetch } from "./_hooks/useFetch";


export default function Home() {


  const { data, isLoading } = useFetch('/api/posts');

  const posts: AdminPost[] = data ? data.posts : [];


  if (isLoading) {
    return <div className="mx-auto text-center mt-5">記事読み込み中！！！</div>
  } else if (posts.length === 0) {
    return
    <div className="mx-auto text-center mt-5">記事が見つかりません</div>
  };

  return (
    <>
      <div className="m-10">
        <span className="text-2xl justify-between text-left m-10 ">記事一覧</span>
      </div>

      {
        posts.map(elem => (
          <Fragment key={elem.id} >
            <Link href={`posts/${elem.id}`}>
              <main className="flex justify-between mx-auto container items-center border border-gray-300 p-5 rounded-2xl">
                {/* <div >
                  <Image src={elem.thumbnail.url}
                    alt="elem.thumbnailUrlの画像"
                    width={elem.thumbnail.width}
                    height={elem.thumbnail.height} />
                </div> */}

                <div className="text-left items-center">
                  <time dateTime={elem.createdAt}>{time(new Date(elem.createdAt))}</time>
                  <span>{elem.postCategories.map(category => (
                    <span className="border border-blue-400 text-blue-400 rounded-2xl p-1" key={elem.id}>{category.category.name}</span>
                  ))}
                  </span>

                  <h6 className="text-2xl">{elem.title}</h6>
                  <div className="line-clamp-2" dangerouslySetInnerHTML={{ __html: elem.content }}></div>
                </div>
              </main>
            </Link>

            <div className="m-5" />

          </Fragment>

        ))}

      <div className="p-10"></div>
    </>
  );

}