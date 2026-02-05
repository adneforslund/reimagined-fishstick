import MovieCarouselClient from '@/components/MovieCarouselClient'
import { fetchRandomMovies } from '@/lib/omdb'

export default async function Home() {
  // Fetch movies on the server
  const initialMovies = await fetchRandomMovies(20)

  return (
    <>
      <header className="mb-8 md:mb-12">
        <h1 className="mb-2 text-3xl font-bold text-zinc-900 md:text-4xl dark:text-white">
          Movie Carousel
        </h1>
        <p className="text-base text-zinc-600 md:text-lg dark:text-zinc-400">
          Browse movies, add them to your favorites, and discover new films
        </p>
      </header>

      <main id="main-content">
        <MovieCarouselClient initialMovies={initialMovies} />
      </main>
    </>
  )
}
