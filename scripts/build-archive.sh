
#!/bin/bash

# Lexi.AI Build & Archive Script
# This script builds the static version and creates a ZIP for publishing.

set -e

# 1. Get version from package.json
VERSION=$(node -p "require('./package.json').version")
ARCHIVE_NAME="lexi-ai-v$VERSION.zip"

echo "🚀 Starting build process for version $VERSION..."

# 2. Build the project (Next.js export)
echo "🏗️  Running Next.js build..."
npm run build

# 3. Create the archive
if [ -d "out" ]; then
  echo "📦 Archiving 'out' directory..."
  # Remove any existing archive with the same name if it exists
  rm -f "$ARCHIVE_NAME"
  
  cd out
  zip -q -r "../$ARCHIVE_NAME" .
  cd ..
  
  echo "✅ Success! Archive created: $ARCHIVE_NAME"
  echo "📍 You can now upload this file to your game platform developer console."
else
  echo "❌ Error: 'out' directory not found. Build might have failed."
  exit 1
fi
