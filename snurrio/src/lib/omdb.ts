import { Movie, OMDbSearchResponse } from '@/types/movie';

const API_KEY = process.env.OMDBKEY;
const BASE_URL = 'https://www.omdbapi.com/';

if (!API_KEY) {
  console.warn('OMDb API key not found. Please set OMDBKEY in .env.local');
}

const SEARCH_TERMS = [
  'love',
  'war',
  'space',
  'hero',
  'time',
  'dark',
  'light',
  'life',
  'death',
  'dream',
  'king',
  'star',
  'power',
  'magic',
  'world',
  'night',
  'day',
  'shadow',
  'fire',
  'water',
];

//Fetches movies from OMDb API based on a search term
async function searchMovies(
  searchTerm: string,
  page: number = 1
): Promise<Movie[]> {
  if (!API_KEY) {
    return [];
  }

  try {
    const url = `${BASE_URL}?apikey=${API_KEY}&s=${encodeURIComponent(searchTerm)}&type=movie&page=${page}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: OMDbSearchResponse = await response.json();

    if (data.Response === 'True' && data.Search) {
      // Filter out movies without posters
      return data.Search.filter((movie) => movie.Poster !== 'N/A');
    }

    return [];
  } catch (error) {
    console.error(`Error fetching movies for term "${searchTerm}":`, error);
    return [];
  }
}

export async function fetchRandomMovies(count: number = 20): Promise<Movie[]> {
  const movies: Movie[] = [];
  const usedIds = new Set<string>();

  // Shuffle search terms for a bit of randomness
  const shuffledTerms = [...SEARCH_TERMS].sort(() => Math.random() - 0.5);

  for (const term of shuffledTerms) {
    if (movies.length >= count) break;

    const results = await searchMovies(term, 1);

    for (const movie of results) {
      if (!usedIds.has(movie.imdbID) && movies.length < count) {
        movies.push(movie);
        usedIds.add(movie.imdbID);
      }
    }

    // Small delay to avoid rate limiting, hopefully
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  return movies;
}

export async function generateNewMovieBatch(
  count: number = 20
): Promise<Movie[]> {
  // Pick random search terms
  const randomTerms = SEARCH_TERMS.sort(() => Math.random() - 0.5).slice(0, 5);

  const movies: Movie[] = [];
  const usedIds = new Set<string>();

  for (const term of randomTerms) {
    if (movies.length >= count) break;

    // Random page number between 1-3 for variety
    const randomPage = Math.floor(Math.random() * 3) + 1;
    const results = await searchMovies(term, randomPage);

    for (const movie of results) {
      if (!usedIds.has(movie.imdbID) && movies.length < count) {
        movies.push(movie);
        usedIds.add(movie.imdbID);
      }
    }

    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  return movies;
}
