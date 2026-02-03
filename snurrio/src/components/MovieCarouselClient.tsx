'use client'

import { useState } from 'react'
import Carousel from '@/components/Carousel'
import { useFavorites } from '@/hooks/useFavorites'
import { Movie } from '@/types/movie'

interface MovieCarouselClientProps {
  initialMovies: Movie[]
}

export default function MovieCarouselClient({
  initialMovies,
}: MovieCarouselClientProps) {
  const [movies, setMovies] = useState<Movie[]>(initialMovies)
  const [isGenerating, setIsGenerating] = useState(false)
  const {
    favorites,
    favoriteIds,
    toggleFavorite,
    clearAllFavorites,
    isLoaded,
  } = useFavorites()

  const handleGenerateNew = async () => {
    setIsGenerating(true)
    try {
      const response = await fetch('/api/movies/generate')
      if (!response.ok) {
        throw new Error('Failed to generate movies')
      }
      const data = await response.json()
      setMovies(data.movies)
    } catch (error) {
      console.error('Error generating new movies:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  if (!isLoaded) {
    return (
      <div className="flex min-h-100 items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-zinc-900 border-r-transparent dark:border-white dark:border-r-transparent"></div>
          <p className="mt-4 text-lg text-zinc-700 dark:text-zinc-300">
            Loading favorites...
          </p>
        </div>
      </div>
    )
  }

  return (
    <>
      <Carousel
        title="Movies"
        movies={movies}
        onToggleFavorite={toggleFavorite}
        favoriteIds={favoriteIds}
        actions={
          <button
            onClick={handleGenerateNew}
            disabled={isGenerating}
            className="min-h-11 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2 focus:outline-none active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 dark:focus:ring-white"
            aria-label="Generate new random movies"
          >
            {isGenerating ? (
              <span className="flex items-center gap-2">
                <svg
                  className="h-4 w-4 animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Generating...
              </span>
            ) : (
              'Generate New'
            )}
          </button>
        }
      />

      <Carousel
        title="Favorites"
        movies={favorites}
        onToggleFavorite={toggleFavorite}
        favoriteIds={favoriteIds}
        emptyMessage="No favorites yet. Add some movies to your favorites!"
        actions={
          favorites.length > 0 ? (
            <button
              onClick={clearAllFavorites}
              className="min-h-11 rounded-lg border-2 border-red-600 px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-600 hover:text-white focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:outline-none active:scale-95 dark:border-red-500 dark:text-red-500 dark:hover:bg-red-500 dark:hover:text-white"
              aria-label="Clear all favorites"
            >
              Clear All
            </button>
          ) : null
        }
      />
    </>
  )
}
