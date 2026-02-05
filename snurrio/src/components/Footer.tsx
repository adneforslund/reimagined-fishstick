export default function Footer() {
  return (
    <footer className="mt-16 border-t border-zinc-200 pt-8 dark:border-zinc-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm text-zinc-500 dark:text-zinc-400">
          Movie data provided by{' '}
          <a
            href="https://www.omdbapi.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-zinc-900 dark:hover:text-zinc-200"
          >
            OMDb API
            <span className="sr-only"> (opens in new tab)</span>
          </a>
        </p>
      </div>
    </footer>
  )
}
