import { Movie } from './types'

const BASE_URL = 'https://www.omdbapi.com/'

function getApiKey() {
  return process.env.OMDBKEY
}

const SEARCH_TERMS = [
  'love', 'war', 'space', 'hero', 'time', 'dark', 'light', 'life',
  'death', 'dream', 'king', 'star', 'power', 'magic', 'world', 'night',
  'day', 'shadow', 'fire', 'water',
]

interface OMDbSearchResponse {
  Search?: Movie[]
  totalResults?: string
  Response: string
}

async function searchMovies(searchTerm: string, page: number = 1): Promise<Movie[]> {
  const apiKey = getApiKey()
  if (!apiKey) {
    console.warn('OMDb API key not found')
    return []
  }

  try {
    const url = `${BASE_URL}?apikey=${apiKey}&s=${encodeURIComponent(searchTerm)}&type=movie&page=${page}`
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json() as OMDbSearchResponse

    if (data.Response === 'True' && data.Search) {
      return data.Search.filter((movie) => movie.Poster !== 'N/A')
    }

    return []
  } catch (error) {
    console.error(`Error fetching movies for term "${searchTerm}":`, error)
    return []
  }
}

export async function fetchRandomMovies(count: number = 20): Promise<Movie[]> {
  const movies: Movie[] = []
  const usedIds = new Set<string>()

  const shuffledTerms = [...SEARCH_TERMS].sort(() => Math.random() - 0.5)

  for (const term of shuffledTerms) {
    if (movies.length >= count) break

    const randomPage = Math.floor(Math.random() * 3) + 1
    const results = await searchMovies(term, randomPage)

    for (const movie of results) {
      if (!usedIds.has(movie.imdbID) && movies.length < count) {
        movies.push(movie)
        usedIds.add(movie.imdbID)
      }
    }

    await new Promise((resolve) => setTimeout(resolve, 100))
  }

  return movies
}

export function hasApiKey(): boolean {
  return !!getApiKey()
}
