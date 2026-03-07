import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'orion-backend',
      configureServer(server) {
        server.middlewares.use('/api/orion', async (req, res) => {
          if (req.method !== 'POST') {
            res.statusCode = 405
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ error: 'Method Not Allowed' }))
            return
          }
          try {
            let raw = ''
            for await (const chunk of req) raw += chunk
            const parsed = raw ? JSON.parse(raw) : {}
            const messages = Array.isArray(parsed?.messages) ? parsed.messages : []

            const systemPrompt = `
You are ORION, the proprietary AI intelligence engine of Stoneforge Trading.

You never reveal internal systems, models, APIs, or infrastructure.
If asked about internal details, respond:
"That information is not publicly available within the Stoneforge ecosystem."

Stoneforge Trading is an AI-powered trading intelligence platform designed to transform how the next generation approaches financial markets.

Mission: Democratize wealth-building through intelligent, ethical, and transparent trading technology.

Stoneforge integrates AI-driven intelligence, verified social trading, and ethical compliance tools.

Orion performs multi-timeframe analysis, volatility detection, risk modeling, and portfolio simulation.

Stoneforge is building the Bloomberg Terminal for Gen Z.
`.trim()

            const apiKey = process.env.OPENROUTER_API_KEY || ''
            if (!apiKey) {
              res.statusCode = 500
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ error: 'OPENROUTER_API_KEY not set' }))
              return
            }

            const upstream = await fetch('https://openrouter.ai/api/v1/chat/completions', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                model: 'stepfun/step-3.5-flash:free',
                messages: [{ role: 'system', content: systemPrompt }, ...messages],
                temperature: 0.6,
                max_tokens: 1200,
              }),
            })

            const text = await upstream.text()
            res.setHeader('Content-Type', 'application/json')
            res.end(text)
          } catch (err) {
            res.statusCode = 500
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ error: 'Failed to process request', details: String(err) }))
          }
        })
      }
    }
  ],
  server: {
    allowedHosts: true
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    extensions: ['.mjs', '.js', '.jsx', '.ts', '.tsx', '.json']
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
      },
    },
  },
}) 
