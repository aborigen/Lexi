#!/bin/bash

# Lexi.AI Build & Archive Script for macOS
# This script builds the static version and creates a ZIP for publishing.

set -e

# Get current date for the archive name
DATE_STR=$(date +%Y-%m-%d)
ARCHIVE_NAME="game-bundle-$DATE_STR.zip"

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
  # Remove any existing archive with the same name if it exists
  rm -f "$ARCHIVE_NAME"
  
  cd out
  zip -r "../$ARCHIVE_NAME" .
  cd ..
  
  echo "✅ Success! Archive created: $ARCHIVE_NAME"
  echo "📍 You can now upload this file to Yandex Games or your hosting provider."
else
  echo "❌ Error: 'out' directory not found. Build might have failed."
  exit 1
fi
