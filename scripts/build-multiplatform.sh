#!/bin/bash

# Lexi.AI Multi-Platform Build & Archive Script
# Usage: ./scripts/build-multiplatform.sh [yandex|vk|sber|standalone]

set -e

PLATFORM=$1

# 1. Validate input or fallback to .env
if [ -z "$PLATFORM" ]; then
  # Load platform from .env if not provided as argument
  if [ -f .env ]; then
    PLATFORM=$(grep NEXT_PUBLIC_GAME_PLATFORM .env | cut -d '=' -f2)
  fi
  
  if [ -z "$PLATFORM" ]; then
    echo "❌ Error: No platform specified and NEXT_PUBLIC_GAME_PLATFORM not found in .env"
    echo "Usage: ./scripts/build-multiplatform.sh [yandex|vk|sber|standalone]"
    exit 1
  fi
fi

echo "🚀 Starting build for platform: $PLATFORM"

# 2. Set environment variable for the build process
export NEXT_PUBLIC_GAME_PLATFORM=$PLATFORM

# 3. Clean previous builds
rm -rf out
rm -f lexi-ai-${PLATFORM}-*.zip

# 4. Run the build
npm run build

# 5. Create the platform-specific archive
VERSION=$(node -p "require('./package.json').version")
ARCHIVE_NAME="lexi-ai-${PLATFORM}-v${VERSION}.zip"

if [ -d "out" ]; then
  echo "📦 Archiving static build for $PLATFORM..."
  cd out
  # Zip the contents of the 'out' directory
  zip -q -r "../$ARCHIVE_NAME" .
  cd ..
  
  echo "✅ Success! Build archive created: $ARCHIVE_NAME"
  echo "📍 Ready for upload to the $PLATFORM developer console."
else
  echo "❌ Error: 'out' directory was not generated. Build failed."
  exit 1
fi
