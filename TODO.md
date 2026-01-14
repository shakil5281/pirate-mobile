# Deployment Fix TODO

Context:
- Amplify build failed with: Cannot find module '@tailwindcss/postcss' while processing app/globals.css via PostCSS/Turbopack.
- Cause: devDependencies were not installed in Amplify default production build; Tailwind v4 requires @tailwindcss/postcss at build time.
- Also .nvmrc set to v24.12.0 which is not guaranteed on Amplify images; we will use Node 20 LTS in CI.

Tasks

- [x] Add amplify.yml to:
  - Use Node 20 with nvm.
  - Install devDependencies (`yarn install --production=false`).
  - Run `yarn build`.
  - Cache node_modules and .next/cache.

- [x] Add "engines" to package.json:
  - `"engines": { "node": ">=20 <25" }`

- [ ] Verify Amplify environment variables (optional, not required for build but required for runtime features):
  - NEXT_PUBLIC_API_BASE_URL
  - NEXT_PUBLIC_BASE_URL
  - NEXT_PUBLIC_WORDPRESS_API_URL (optional; defaults to https://www.piratemobile.net/graphql in code)
  - PAYPAL_CLIENT_ID
  - PAYPAL_SECRET (or PAYPAL_CLIENT_SECRET depending on your naming)
  - PAYPAL_ENVIRONMENT (production or sandbox)
  - Firebase (all NEXT_PUBLIC_FIREBASE_* keys):
    - NEXT_PUBLIC_FIREBASE_API_KEY
    - NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
    - NEXT_PUBLIC_FIREBASE_PROJECT_ID
    - NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
    - NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
    - NEXT_PUBLIC_FIREBASE_APP_ID
    - NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID

- [ ] Trigger a new Amplify build (push or rebuild) and confirm success.

Notes
- Keeping `@tailwindcss/postcss` in devDependencies is fine since CI now installs devDeps. If you prefer extra safety, you may move it to dependencies, but it is not necessary.
- Local .nvmrc remains at v24.12.0; Amplify CI uses Node 20 per amplify.yml for compatibility with Next.js 16.
