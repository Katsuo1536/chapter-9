import { prisma } from "@/app/_libs/prisma";
import { NextResponse, NextRequest } from "next/server";
import { supabase } from "@/app/_libs/supabase";

export type CategoryShowResponse = {
  category: {
    id: number
    name: string
    createdAt: Date
    updatedAt: Date
  }[]
}

export type CategoryRequest = {
  name: string
}

export const GET = async (_request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {

  const token = _request.headers.get('Authorization') ?? ''

  const { error } = await supabase.auth.getUser(token)

  if (error)
    return NextResponse.json({ status: error.message }, { status: 400 })

  const { id } = await params;

  try {
    const category = await prisma.category.findUnique({
      where: {
        id: parseInt(id)
      },
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
    })

    if (!category) {
      return NextResponse.json({ message: "カテゴリーが見つかりません" }, { status: 404 })
    }

    return NextResponse.json<CategoryShowResponse>({ category }, { status: 200 })
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ message: error.message }, { status: 400 })
  }
}

export const PUT = async (_request: NextRequest,
  { params }: { params: Promise<{ id: string }> }) => {

  const token = _request.headers.get('Authorization') ?? ''

  const { error } = await supabase.auth.getUser(token)

  if (error)
    return NextResponse.json({ status: error.message }, { status: 400 })


  const { id } = await params;
  const req: CategoryRequest = await _request.json();

  try {
    const category = await prisma.category.update({

      where: { id: parseInt(id) },
      data: { name: req.name }

    })


    return NextResponse.json({ category }, { status: 200 })
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ message: error.message }, { status: 400 })
  }
}

export const DELETE = async (_request: NextRequest,
  { params }: { params: Promise<{ id: string }> }) => {

  const token = _request.headers.get('Authorization') ?? ''

  const { error } = await supabase.auth.getUser(token)

  if (error)
    return NextResponse.json({ status: error.message }, { status: 400 })

  const { id } = await params;

  try {

    const category = await prisma.category.delete({
      where: {
        id: parseInt(id),
      }
    })

    return NextResponse.json({ category }, { status: 200 })
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ message: error.message }, { status: 400 })
  }
}