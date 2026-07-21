#!/bin/bash

# Lexi.AI Build & Archive Script for macOS
# This script builds the static version and creates a ZIP for publishing.

set -e

echo "🚀 Starting build process..."

# 1. Install dependencies if needed
if [ ! -d "node_modules" ]; then
  echo "📦 Installing dependencies..."
  npm install
fi

# 2. Build the project
echo "🏗️  Running Next.js build..."
npm run build

# 3. Create the archive
if [ -d "out" ]; then
  echo "📦 Archiving 'out' directory..."
  rm -f game-bundle.zip
  cd out
  zip -r ../game-bundle.zip .
  cd ..
  echo "✅ Success! Archive created: game-bundle.zip"
  echo "📍 You can now upload this file to Yandex Games or your hosting provider."
else
  echo "❌ Error: 'out' directory not found. Build might have failed."
  exit 1
fi
