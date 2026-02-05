'use client'

import { Movie } from '@/types/movie'
import { useRef, useState, useEffect, ReactNode } from 'react'
import MovieCard from './MovieCard'

interface CarouselProps {
  title: string
  movies: Movie[]
  onToggleFavorite?: (movie: Movie) => void
  favoriteIds?: Set<string>
  emptyMessage?: string
  actions?: ReactNode
}

export default function Carousel({
  title,
  movies,
  onToggleFavorite,
  favoriteIds = new Set(),
  emptyMessage = 'No movies to display',
  actions,
}: CarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)
  const [showLeftButton, setShowLeftButton] = useState(false)
  const [showRightButton, setShowRightButton] = useState(true)
  const [focusedIndex, setFocusedIndex] = useState(-1)

  // Handle scroll button visibility
  const updateScrollButtons = () => {
    const container = scrollContainerRef.current
    if (!container) return

    const { scrollLeft, scrollWidth, clientWidth } = container
    setShowLeftButton(scrollLeft > 0)
    setShowRightButton(scrollLeft < scrollWidth - clientWidth - 10)
  }

  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    updateScrollButtons()
    container.addEventListener('scroll', updateScrollButtons)
    window.addEventListener('resize', updateScrollButtons)

    return () => {
      container.removeEventListener('scroll', updateScrollButtons)
      window.removeEventListener('resize', updateScrollButtons)
    }
  }, [movies])

  // Mouse drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return
    setIsDragging(true)
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft)
    setScrollLeft(scrollContainerRef.current.scrollLeft)
    scrollContainerRef.current.style.cursor = 'grabbing'
  }

  const handleMouseLeave = () => {
    setIsDragging(false)
    if (scrollContainerRef.current) {
      scrollContainerRef.current.style.cursor = 'grab'
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
    if (scrollContainerRef.current) {
      scrollContainerRef.current.style.cursor = 'grab'
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return
    e.preventDefault()
    const x = e.pageX - scrollContainerRef.current.offsetLeft
    const walk = (x - startX) * 2 // Scroll speed multiplier
    scrollContainerRef.current.scrollLeft = scrollLeft - walk
  }

  // Scroll button handlers
  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return
    const scrollAmount = 400
    const newScrollLeft =
      direction === 'left'
        ? scrollContainerRef.current.scrollLeft - scrollAmount
        : scrollContainerRef.current.scrollLeft + scrollAmount

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    scrollContainerRef.current.scrollTo({
      left: newScrollLeft,
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    })
  }

  // Scroll a specific movie into view
  const scrollToIndex = (index: number) => {
    const container = scrollContainerRef.current
    if (!container) return
    const items = container.querySelectorAll('[role="listitem"]')
    const item = items[index] as HTMLElement
    if (!item) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    item.scrollIntoView({
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
      block: 'nearest',
      inline: 'center',
    })
  }

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault()
      const newIndex = focusedIndex <= 0 ? movies.length - 1 : focusedIndex - 1
      setFocusedIndex(newIndex)
      scrollToIndex(newIndex)
    } else if (e.key === 'ArrowRight') {
      e.preventDefault()
      const newIndex = focusedIndex >= movies.length - 1 ? 0 : focusedIndex + 1
      setFocusedIndex(newIndex)
      scrollToIndex(newIndex)
    } else if ((e.key === 'Enter' || e.key === ' ') && focusedIndex >= 0 && onToggleFavorite) {
      e.preventDefault()
      onToggleFavorite(movies[focusedIndex])
    }
  }

  // Reset focus when carousel loses focus
  const handleBlur = (e: React.FocusEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setFocusedIndex(-1)
    }
  }

  // Set initial focus index when carousel gains focus
  const handleFocus = () => {
    if (focusedIndex === -1 && movies.length > 0) {
      setFocusedIndex(0)
    }
  }

  if (movies.length === 0) {
    return (
      <section className="mb-8 md:mb-12" aria-labelledby={`${title}-heading`}>
        <div className="mb-4 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
          <h2
            id={`${title}-heading`}
            className="text-xl font-bold text-zinc-900 md:text-2xl dark:text-white"
          >
            {title}
          </h2>
          {actions}
        </div>
        <div className="flex h-75 items-center justify-center rounded-lg border-2 border-dashed border-zinc-300 dark:border-zinc-700">
          <p className="px-4 text-center text-sm text-zinc-500 md:text-base dark:text-zinc-400">
            {emptyMessage}
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className="mb-8 md:mb-12" aria-labelledby={`${title}-heading`}>
      <div className="mb-4 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <h2
          id={`${title}-heading`}
          className="text-xl font-bold text-zinc-900 md:text-2xl dark:text-white"
        >
          {title}
        </h2>
        {actions}
      </div>

      <div className="group/carousel relative">
        {showLeftButton && (
          <button
            onClick={() => scroll('left')}
            className="absolute top-1/2 left-0 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white opacity-60 transition-all duration-300 group-hover/carousel:opacity-100 hover:scale-110 hover:bg-black/90 focus:opacity-100 focus:ring-2 focus:ring-white focus:outline-none motion-reduce:transition-none"
            aria-label="Scroll left"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6"
              aria-hidden="true"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
        )}

        <div
          ref={scrollContainerRef}
          className="scrollbar-hide flex cursor-grab gap-4 overflow-x-auto pb-4 active:cursor-grabbing rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2 dark:focus:ring-white"
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          tabIndex={0}
          role="list"
          aria-label={`${title} carousel. Use arrow keys to navigate, Enter or Space to toggle favorite.`}
          aria-activedescendant={focusedIndex >= 0 ? `${title}-movie-${focusedIndex}` : undefined}
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {movies.map((movie, index) => (
            <div
              key={movie.imdbID}
              role="listitem"
              id={`${title}-movie-${index}`}
            >
              <MovieCard
                movie={movie}
                onToggleFavorite={onToggleFavorite}
                isFavorite={favoriteIds.has(movie.imdbID)}
                isFocused={focusedIndex === index}
              />
            </div>
          ))}
        </div>

        {showRightButton && (
          <button
            onClick={() => scroll('right')}
            className="absolute top-1/2 right-0 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white opacity-60 transition-all duration-300 group-hover/carousel:opacity-100 hover:scale-110 hover:bg-black/90 focus:opacity-100 focus:ring-2 focus:ring-white focus:outline-none motion-reduce:transition-none"
            aria-label="Scroll right"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6"
              aria-hidden="true"
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        )}
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  )
}
