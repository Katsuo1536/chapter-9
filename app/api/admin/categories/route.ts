import { prisma } from "@/app/_libs/prisma";
import { NextResponse, NextRequest } from "next/server";
import { supabase } from "@/app/_libs/supabase";

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

export type PostCategoryRequest = {
  name: string
}

export const GET = async (request: NextRequest) => {

  const token = request.headers.get('Authorization') ?? ''

  const { error } = await supabase.auth.getUser(token)

  if (error)
    return NextResponse.json({ status: error.message }, { status: 401 })

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

  const token = request.headers.get('Authorization') ?? ''

  const { error } = await supabase.auth.getUser(token)

  if (error)
    return NextResponse.json({ status: error.message }, { status: 401 });

  const req: PostCategoryRequest = await request.json();

  try {
    const categories = await prisma.category.create({
      data: {
        name: req.name,
      }
    })

    return NextResponse.json({ categories }, { status: 200 })
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ message: error.message }, { status: 400 })
  }
}