#!/bin/bash
npx vite build
npx esbuild server/index-prod.ts --platform=node --bundle --format=esm --outfile=dist/index.js
