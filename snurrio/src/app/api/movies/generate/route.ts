import { generateNewMovieBatch } from '@/lib/omdb'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const movies = await generateNewMovieBatch(20)
    return NextResponse.json({ movies })
  } catch (error) {
    console.error('Error generating movies:', error)
    return NextResponse.json(
      { error: 'Failed to generate movies' },
      { status: 500 }
    )
  }
}
