'use client'

import { Movie } from '@/types/movie'
import Image from 'next/image'
import { useState } from 'react'

interface HeartIconProps {
  filled: boolean
}

function HeartIcon({ filled }: HeartIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="2"
      className="h-6 w-6"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
      />
    </svg>
  )
}

interface FavoriteButtonProps {
  movie: Movie
  isFavorite: boolean
  isFocused: boolean
  onToggle: (movie: Movie) => void
}

function FavoriteButton({
  movie,
  isFavorite,
  isFocused,
  onToggle,
}: FavoriteButtonProps) {
  return (
    <button
      onClick={() => onToggle(movie)}
      tabIndex={-1}
      className={`absolute top-2 right-2 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-black/60 text-white opacity-100 transition-all duration-300 hover:scale-110 hover:bg-black/80 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-transparent focus:outline-none active:scale-95 active:bg-black/90 ${isFocused ? '' : 'md:opacity-0 md:group-hover:opacity-100 md:focus:opacity-100'}`}
      aria-label={
        isFavorite
          ? `Remove ${movie.Title} from favorites`
          : `Add ${movie.Title} to favorites`
      }
      aria-pressed={isFavorite}
    >
      <HeartIcon filled={isFavorite} />
    </button>
  )
}

interface MoviePosterProps {
  movie: Movie
  hasPoster: boolean
  onImageError: () => void
}

function MoviePoster({ movie, hasPoster, onImageError }: MoviePosterProps) {
  if (hasPoster) {
    return (
      <Image
        src={movie.Poster}
        alt={`${movie.Title} poster`}
        fill
        sizes="200px"
        className="object-cover transition-opacity duration-300 group-hover:opacity-80"
        onError={onImageError}
        priority={false}
      />
    )
  }

  return (
    <div className="flex h-full items-center justify-center bg-linear-to-br from-zinc-700 to-zinc-900 p-4">
      <p className="text-center text-sm font-medium text-white">
        {movie.Title}
      </p>
    </div>
  )
}

interface MovieOverlayProps {
  title: string
  year: string
  isFocused: boolean
}

function MovieOverlay({ title, year, isFocused }: MovieOverlayProps) {
  return (
    <div
      className={`absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent opacity-100 transition-opacity duration-300 ${isFocused ? '' : 'md:opacity-0 md:group-hover:opacity-100'}`}
    >
      <div className="absolute right-0 bottom-0 left-0 p-3 md:p-4">
        <h3 className="mb-1 line-clamp-2 text-sm font-bold text-white md:text-sm">
          {title}
        </h3>
        <p className="text-xs text-zinc-300">{year}</p>
      </div>
    </div>
  )
}

interface MovieCardProps {
  movie: Movie
  onToggleFavorite?: (movie: Movie) => void
  isFavorite?: boolean
  isFocused?: boolean
}

export default function MovieCard({
  movie,
  onToggleFavorite,
  isFavorite = false,
  isFocused = false,
}: MovieCardProps) {
  const [imageError, setImageError] = useState(false)
  const hasPoster = movie.Poster !== 'N/A' && !imageError

  return (
    <div
      className={`group relative w-40 shrink-0 rounded-lg transition-transform duration-300 focus-within:scale-105 hover:scale-105 motion-reduce:transition-none sm:w-48 md:w-50 ${
        isFocused
          ? 'scale-105 ring-2 ring-white ring-offset-2 ring-offset-zinc-900'
          : ''
      }`}
      role="article"
      aria-label={`${movie.Title} (${movie.Year})${isFavorite ? ' - In favorites' : ''}`}
    >
      <div className="relative aspect-2/3 overflow-hidden rounded-lg bg-zinc-800 shadow-lg">
        <MoviePoster
          movie={movie}
          hasPoster={hasPoster}
          onImageError={() => setImageError(true)}
        />
        <MovieOverlay
          title={movie.Title}
          year={movie.Year}
          isFocused={isFocused}
        />
        {onToggleFavorite && (
          <FavoriteButton
            movie={movie}
            isFavorite={isFavorite}
            isFocused={isFocused}
            onToggle={onToggleFavorite}
          />
        )}
      </div>
    </div>
  )
}
