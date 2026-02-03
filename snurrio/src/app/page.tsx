import MovieCarouselClient from '@/components/MovieCarouselClient';
import { fetchRandomMovies } from '@/lib/omdb';

export default async function Home() {
  // Fetch movies on the server
  const initialMovies = await fetchRandomMovies(20);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <header className="mb-8 md:mb-12">
          <h1 className="mb-2 text-3xl font-bold text-zinc-900 md:text-4xl dark:text-white">
            Movie Carousel
          </h1>
          <p className="text-base text-zinc-600 md:text-lg dark:text-zinc-400">
            Browse movies, add them to your favorites, and discover new films
          </p>
        </header>

        <main>
          <MovieCarouselClient initialMovies={initialMovies} />
        </main>

        <footer className="mt-16 border-t border-zinc-200 pt-8 dark:border-zinc-800">
          <p className="text-center text-sm text-zinc-500 dark:text-zinc-400">
            Movie data provided by{' '}
            <a
              href="https://www.omdbapi.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-zinc-900 dark:hover:text-zinc-200"
            >
              OMDb API
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}
