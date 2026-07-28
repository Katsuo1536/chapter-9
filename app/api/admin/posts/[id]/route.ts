import { prisma } from "@/app/_libs/prisma";
import { NextResponse, NextRequest } from "next/server";


export type PostResponse = {
  post: {
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
  }
}

export type UpdateOfType = {
  title: string
  content: string
  thumbnailURL: string
  categories: number[]
}

export const GET = async (_request: NextRequest,
  { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  try {
    const post = await prisma.post.findUnique({
      where: {
        id: parseInt(id)
      },
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
    })

    console.log(post)

    if (!post) {
      return NextResponse.json({ message: "記事が見つかりません" }, { status: 404 })
    }

    return NextResponse.json<PostResponse>({ post }, { status: 200 })
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ message: error.message }, { status: 400 })
  }
}


export const PUT = async (request: NextRequest,
  { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const req: UpdateOfType = await request.json();

  try {
    const post = await prisma.post.update({
      where: { id: parseInt(id) },
      data: {
        title: req.title,
        content: req.content,
        thumbnailURL: req.thumbnailUrl,
      },
    })

    await prisma.postCategory.deleteMany({
      where: { postId: parseInt(id) },
    })

    for (const category of req.categories) {
      await prisma.postCategory.create({
        data: {
          categoryId: category,
          postId: post.id
        }
      })
    }

    return NextResponse.json({ post }, { status: 200 })
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ message: error.message }, { status: 400 })
  }
}

export const DELETE = async (_request: NextRequest,
  { params }: { params: Promise<{ id: string }> }) => {

  const { id } = await params;

  try {
    const post = await prisma.post.delete({
      where: {
        id: parseInt(id)
      }
    })

    return NextResponse.json({ post }, { status: 200 })
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ message: error.message }, { status: 400 })
  }
}