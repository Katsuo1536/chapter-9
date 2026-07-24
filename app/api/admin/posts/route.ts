import { prisma } from "@/app/_libs/prisma";
import { NextRequest, NextResponse } from "next/server";


export type PostsIndexResponse = {
  posts: {
    id: number
    title: string
    content: string
    thumbnailURL: string
    createdAt: Date
    updatedAt: Date
    postCategories: {
      category: {
        id: number
        name: string
      }
    }[]
  }[]
}

export type PostOfType = {
  title: string
  content: string
  thumbnailURL: string
  categories: number[]
}

export const GET = async () => {
  try {
    const posts = await prisma.post.findMany({
      include: {
        postCategories: {
          include: {
            category: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json<PostsIndexResponse>({ posts }, { status: 200 })
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ message: error.message }, { status: 400 })
  }
}


export const POST = async (request: NextRequest) => {
  const req: PostOfType = await request.json();
  console.log(req)
  try {
    const posts = await prisma.post.create({
      data: {
        title: req.title,
        content: req.content,
        thumbnailURL: req.thumbnailUrl
      },

    })

    for (const category of req.categories) {
      await prisma.postCategory.create({
        data: {
          categoryId: category,
          postId: posts.id,
        },
      })

    }

    return NextResponse.json({ posts }, { status: 200 })
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ message: error.message }, { status: 400 })
  }
}