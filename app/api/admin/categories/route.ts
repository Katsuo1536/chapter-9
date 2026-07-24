import { prisma } from "@/app/_libs/prisma";
import { NextResponse, NextRequest } from "next/server";

export type CategoriesIndexResponse = {
  categories: {
    id: number
    name: string
    createdAt: Date
    updatedAt: Date
    posts: {
      post: {
        id: number
      }
    }[]
  }[]
}

type PostCategoryRequest = {
  id: number
  name: string
  createdAt: Date
  updatedAt: Date
}

export const GET = async () => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        posts: {
          include: {
            post: {
              select: {
                id: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })


    return NextResponse.json<CategoriesIndexResponse>({ categories }, { status: 200 })
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ message: error.message }, { status: 400 })
  }
}

export const POST = async (request: NextRequest) => {
  const req: PostCategoryRequest = await request.json();

  try {
    const categories = await prisma.category.create({
      data: {
        name: req.name,
      }
    })

    //  下のコードの型が何になるのか。
    return NextResponse.json({ categories }, { status: 200 })
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ message: error.message }, { status: 400 })
  }
}