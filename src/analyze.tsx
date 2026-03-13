import { Hono } from 'hono'
import { analyzeApi } from './api/analyzeEndpoint'
import { analyzePage } from './pages/AnalyzerPage'

export const analyzeApp = new Hono()

// Mount the decoupled routes
analyzeApp.route('/', analyzeApi)
analyzeApp.route('/', analyzePage)
