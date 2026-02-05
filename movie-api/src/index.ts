import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })
import express from 'express'
import cors from 'cors'
import { fetchRandomMovies, hasApiKey } from './omdb'

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

// GET /api/movies/generate - Fetch random movies from OMDb
app.get('/api/movies/generate', async (req, res) => {
  try {
    const count = parseInt(req.query.count as string) || 20
    const movies = await fetchRandomMovies(count)
    res.json({ movies })
  } catch (error) {
    console.error('Error fetching movies:', error)
    res.status(500).json({ error: 'Failed to fetch movies' })
  }
})

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', hasApiKey: hasApiKey() })
})

app.listen(PORT, () => {
  console.log(`Movie API running at http://localhost:${PORT}`)
  console.log(`OMDb API key: ${hasApiKey() ? 'configured' : 'NOT CONFIGURED'}`)
  console.log(`Endpoints:`)
  console.log(`  GET /api/movies/generate - Fetch random movies from OMDb`)
  console.log(`  GET /health              - Health check`)
})
