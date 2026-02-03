'use client';

import { Movie } from '@/types/movie';
import { useRef, useState, useEffect, ReactNode } from 'react';
import MovieCard from './MovieCard';

interface CarouselProps {
  title: string;
  movies: Movie[];
  onToggleFavorite?: (movie: Movie) => void;
  favoriteIds?: Set<string>;
  emptyMessage?: string;
  actions?: ReactNode;
}

export default function Carousel({
  title,
  movies,
  onToggleFavorite,
  favoriteIds = new Set(),
  emptyMessage = 'No movies to display',
  actions,
}: CarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(true);

  // Handle scroll button visibility
  const updateScrollButtons = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const { scrollLeft, scrollWidth, clientWidth } = container;
    setShowLeftButton(scrollLeft > 0);
    setShowRightButton(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    updateScrollButtons();
    container.addEventListener('scroll', updateScrollButtons);
    window.addEventListener('resize', updateScrollButtons);

    return () => {
      container.removeEventListener('scroll', updateScrollButtons);
      window.removeEventListener('resize', updateScrollButtons);
    };
  }, [movies]);

  // Mouse drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
    scrollContainerRef.current.style.cursor = 'grabbing';
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.style.cursor = 'grab';
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.style.cursor = 'grab';
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Scroll speed multiplier
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  // Scroll button handlers
  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    const scrollAmount = 400;
    const newScrollLeft =
      direction === 'left'
        ? scrollContainerRef.current.scrollLeft - scrollAmount
        : scrollContainerRef.current.scrollLeft + scrollAmount;

    scrollContainerRef.current.scrollTo({
      left: newScrollLeft,
      behavior: 'smooth',
    });
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      scroll('left');
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      scroll('right');
    }
  };

  if (movies.length === 0) {
    return (
      <section className="mb-8 md:mb-12" aria-labelledby={`${title}-heading`}>
        <div className="mb-4 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
          <h2
            id={`${title}-heading`}
            className="text-xl font-bold text-zinc-900 dark:text-white md:text-2xl"
          >
            {title}
          </h2>
          {actions}
        </div>
        <div className="flex h-75 items-center justify-center rounded-lg border-2 border-dashed border-zinc-300 dark:border-zinc-700">
          <p className="px-4 text-center text-sm text-zinc-500 dark:text-zinc-400 md:text-base">
            {emptyMessage}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="mb-8 md:mb-12" aria-labelledby={`${title}-heading`}>
      <div className="mb-4 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <h2
          id={`${title}-heading`}
          className="text-xl font-bold text-zinc-900 dark:text-white md:text-2xl"
        >
          {title}
        </h2>
        {actions}
      </div>

      <div className="group/carousel relative">
        {showLeftButton && (
          <button
            onClick={() => scroll('left')}
            className="absolute top-1/2 left-0 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-black/70 text-white opacity-0 transition-all duration-300 group-hover/carousel:opacity-100 hover:scale-110 hover:bg-black/90 focus:opacity-100 focus:ring-2 focus:ring-white focus:outline-none"
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
          className="scrollbar-hide flex cursor-grab gap-4 overflow-x-auto pb-4 active:cursor-grabbing"
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          role="list"
          aria-label={`${title} carousel`}
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {movies.map((movie) => (
            <div key={movie.imdbID} role="listitem">
              <MovieCard
                movie={movie}
                onToggleFavorite={onToggleFavorite}
                isFavorite={favoriteIds.has(movie.imdbID)}
              />
            </div>
          ))}
        </div>

        {showRightButton && (
          <button
            onClick={() => scroll('right')}
            className="absolute top-1/2 right-0 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-black/70 text-white opacity-0 transition-all duration-300 group-hover/carousel:opacity-100 hover:scale-110 hover:bg-black/90 focus:opacity-100 focus:ring-2 focus:ring-white focus:outline-none"
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
  );
}
