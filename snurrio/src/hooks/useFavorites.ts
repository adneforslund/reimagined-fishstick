'use client'

import { Movie } from '@/types/movie'
import { useState, useEffect } from 'react'

const FAVORITES_KEY = 'movie-favorites'

export function useFavorites() {
  const [favorites, setFavorites] = useState<Movie[]>([])
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set())
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(FAVORITES_KEY)
      if (stored) {
        const parsedFavorites: Movie[] = JSON.parse(stored)
        setFavorites(parsedFavorites)
        setFavoriteIds(new Set(parsedFavorites.map((m) => m.imdbID)))
      }
    } catch (error) {
      console.error('Error loading favorites from localStorage:', error)
    } finally {
      setIsLoaded(true)
    }
  }, [])

  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites))
      } catch (error) {
        console.error('Error saving favorites to localStorage:', error)
      }
    }
  }, [favorites, isLoaded])

  const toggleFavorite = (movie: Movie) => {
    setFavorites((prev) => {
      const exists = prev.some((m) => m.imdbID === movie.imdbID)

      if (exists) {
        // Remove from favorites
        const updated = prev.filter((m) => m.imdbID !== movie.imdbID)
        setFavoriteIds(new Set(updated.map((m) => m.imdbID)))
        return updated
      } else {
        // Add to favorites
        const updated = [...prev, movie]
        setFavoriteIds(new Set(updated.map((m) => m.imdbID)))
        return updated
      }
    })
  }

  const clearAllFavorites = () => {
    setFavorites([])
    setFavoriteIds(new Set())
  }

  const isFavorite = (movieId: string): boolean => {
    return favoriteIds.has(movieId)
  }

  return {
    favorites,
    favoriteIds,
    toggleFavorite,
    clearAllFavorites,
    isFavorite,
    isLoaded,
  }
}
