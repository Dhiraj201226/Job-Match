import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { getProviderConfig, analyzeJobMatch } from './lib/llm.js';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load environment variables from frontend or root .env
  const env = loadEnv(mode, process.cwd(), '');
  Object.assign(process.env, env);

  return {
    server: {
      port: 5174,
      host: true
    },
    plugins: [
      tailwindcss(),
      react(),
      {
        name: 'jobmatch-api-middleware',
        configureServer(server) {
          server.middlewares.use(async (req, res, next) => {
            const url = req.url.split('?')[0];

            if (url === '/api/status' && req.method === 'GET') {
              res.setHeader('Content-Type', 'application/json');
              try {
                const config = getProviderConfig(process.env);
                res.statusCode = 200;
                res.end(JSON.stringify({
                  mode: config.mode,
                  model: config.model,
                  badgeText: config.badgeText,
                  badgeType: config.badgeType,
                  privacyNotice: config.privacyNotice,
                  configured: config.mode === 'cloud' ? config.hasApiKey : true
                }));
              } catch (e) {
                res.statusCode = 500;
                res.end(JSON.stringify({ error: e.message }));
              }
              return;
            }

            if (url === '/api/analyze' && req.method === 'POST') {
              res.setHeader('Content-Type', 'application/json');
              let body = '';
              req.on('data', chunk => {
                body += chunk;
              });
              req.on('end', async () => {
                try {
                  const data = JSON.parse(body || '{}');
                  const resumeText = data.resumeText || data.resume || '';
                  const jobDescription = data.jobDescription || data.job || data.role || '';
                  const tone = data.tone;

                  if (!resumeText.trim()) {
                    res.statusCode = 400;
                    res.end(JSON.stringify({ error: 'Resume or profile text is required.' }));
                    return;
                  }

                  if (!jobDescription.trim()) {
                    res.statusCode = 400;
                    res.end(JSON.stringify({ error: 'Job post or gig listing text is required.' }));
                    return;
                  }

                  const result = await analyzeJobMatch({
                    resumeText,
                    jobDescription,
                    tone,
                    env: process.env
                  });

                  res.statusCode = 200;
                  res.end(JSON.stringify(result));
                } catch (err) {
                  res.statusCode = 500;
                  res.end(JSON.stringify({ error: err.message || 'Analysis failed' }));
                }
              });
              return;
            }

            next();
          });
        }
      }
    ]
  };
});
