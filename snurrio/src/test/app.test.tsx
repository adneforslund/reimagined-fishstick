import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { renderHook, act } from '@testing-library/react'
import { useFavorites } from '@/hooks/useFavorites'
import MovieCard from '@/components/MovieCard'
import Carousel from '@/components/Carousel'
import type { Movie } from '@/types/movie'

const mockMovie: Movie = {
  imdbID: 'tt1234567',
  Title: 'Test Movie',
  Year: '2024',
  Type: 'movie',
  Poster: 'https://example.com/poster.jpg',
}

const mockMovies: Movie[] = [
  mockMovie,
  {
    imdbID: 'tt7654321',
    Title: 'Another Movie',
    Year: '2023',
    Type: 'movie',
    Poster: 'https://example.com/poster2.jpg',
  },
]

beforeEach(() => {
  vi.clearAllMocks()
  window.localStorage.getItem = vi.fn(() => null)
  window.localStorage.setItem = vi.fn()
})

describe('useFavorites hook', () => {
  it('toggles a movie in and out of favorites', async () => {
    const { result } = renderHook(() => useFavorites())

    // Initially no favorites
    expect(result.current.favorites).toHaveLength(0)
    expect(result.current.isFavorite(mockMovie.imdbID)).toBe(false)

    // Add to favorites
    act(() => {
      result.current.toggleFavorite(mockMovie)
    })

    expect(result.current.favorites).toHaveLength(1)
    expect(result.current.isFavorite(mockMovie.imdbID)).toBe(true)

    // Remove from favorites
    act(() => {
      result.current.toggleFavorite(mockMovie)
    })

    expect(result.current.favorites).toHaveLength(0)
    expect(result.current.isFavorite(mockMovie.imdbID)).toBe(false)
  })
})

describe('MovieCard component', () => {
  it('renders movie title and year', () => {
    render(<MovieCard movie={mockMovie} />)

    expect(screen.getByText('Test Movie')).toBeInTheDocument()
    expect(screen.getByText('2024')).toBeInTheDocument()
  })
})

describe('Carousel component', () => {
  it('renders all movies in the carousel', () => {
    render(<Carousel title="Test Carousel" movies={mockMovies} />)

    expect(screen.getByText('Test Carousel')).toBeInTheDocument()
    expect(screen.getByText('Test Movie')).toBeInTheDocument()
    expect(screen.getByText('Another Movie')).toBeInTheDocument()
  })
})

describe('Carousel empty state', () => {
  it('shows empty message when no movies', () => {
    render(
      <Carousel
        title="Empty Carousel"
        movies={[]}
        emptyMessage="No movies found"
      />
    )

    expect(screen.getByText('Empty Carousel')).toBeInTheDocument()
    expect(screen.getByText('No movies found')).toBeInTheDocument()
  })
})
