import { put } from '@vercel/blob'
import { NextResponse } from 'next/server'

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ Message: 'Failed', status: 500 })
    }
    const blob = await put(file?.name, file, {
      access: 'public',
    })

    return NextResponse.json(blob)
  } catch (error) {
    return NextResponse.json({ Message: 'Failed', status: 500 })
  }
}
