#!/bin/sh
set -e

SCRIPT_DIR=$(cd "$(dirname "$0")" && pwd)

if [ -n "${CI_PRIMARY_REPOSITORY_PATH:-}" ] && [ -f "$CI_PRIMARY_REPOSITORY_PATH/package.json" ]; then
  REPO_ROOT="$CI_PRIMARY_REPOSITORY_PATH"
elif [ -f "$SCRIPT_DIR/../package.json" ]; then
  REPO_ROOT=$(cd "$SCRIPT_DIR/.." && pwd)
elif [ -f "$SCRIPT_DIR/../../../package.json" ]; then
  REPO_ROOT=$(cd "$SCRIPT_DIR/../../.." && pwd)
else
  echo "Unable to locate repository root"
  exit 1
fi

cd "$REPO_ROOT"

echo "Installing JavaScript dependencies"
npm ci

echo "Building web assets"
npm run build

echo "Copying Capacitor assets to iOS"
npx cap copy ios

echo "Installing CocoaPods dependencies"
cd "$REPO_ROOT/ios/App"
pod install
