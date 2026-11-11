import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
import Stripe from 'stripe'

export default defineConfig(({ mode }) => {
  // Load env variables based on mode (development/production)
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      react(), 
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
        manifest: {
          name: 'Grab-and-Go Food Delivery',
          short_name: 'GrabNGo',
          description: 'Local Food Delivery App',
          theme_color: '#FDF5E6',
          icons: [
            {
              src: 'pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png'
            },
            {
              src: 'pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any maskable'
            }
          ]
        }
      }),
      // Custom Dev Middleware for Stripe API
      {
        name: 'stripe-api-dev-server',
        configureServer(server) {
          server.middlewares.use('/api/create-payment-intent', async (req, res) => {
            if (req.method !== 'POST') {
              res.statusCode = 405;
              res.end(JSON.stringify({ error: 'Method not allowed' }));
              return;
            }

            let body = '';
            req.on('data', (chunk) => {
              body += chunk;
            });

            req.on('end', async () => {
              try {
                const { amount, currency = 'usd' } = JSON.parse(body || '{}');
                const stripeSecret = env.STRIPE_SECRET_KEY;

                if (!stripeSecret) {
                  res.statusCode = 500;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ error: 'STRIPE_SECRET_KEY is missing in your .env file' }));
                  return;
                }

                const stripe = new Stripe(stripeSecret);
                const paymentIntent = await stripe.paymentIntents.create({
                  amount: Math.round(amount),
                  currency,
                });

                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ clientSecret: paymentIntent.client_secret }));
              } catch (err) {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: err.message }));
              }
            });
          });
        },
      },
    ],
    server: {
      port: 7979,
      host: true
    }
  }
})