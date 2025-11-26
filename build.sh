#!/bin/bash
npx vite build
npx esbuild server/index-prod.ts --platform=node --bundle --format=esm --banner:js="import { createRequire } from 'module'; const require = createRequire(import.meta.url);" --outfile=dist/index.js
