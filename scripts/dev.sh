#!/bin/bash

# G0 Experience - Development Server Script
# Usage: ./scripts/dev.sh

set -e

PORT=3005
PROJECT_DIR="$(cd "$(dirname "$0")/.." && pwd)"

echo "🚀 G0 Experience Dev Server"
echo "=========================="

# Kill any existing Next.js processes on our port
echo "→ Cleaning up old processes..."
lsof -ti :$PORT | xargs kill -9 2>/dev/null || true
pkill -f "next dev.*$PORT" 2>/dev/null || true

# Clear Next.js cache
echo "→ Clearing .next cache..."
rm -rf "$PROJECT_DIR/.next"

# Start dev server
echo "→ Starting dev server on port $PORT..."
echo ""
cd "$PROJECT_DIR" && npm run dev -- -p $PORT
