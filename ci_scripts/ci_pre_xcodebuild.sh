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

export PATH="/opt/homebrew/bin:/usr/local/bin:$PATH"

PODS_XCCONFIG="ios/App/Pods/Target Support Files/Pods-App/Pods-App.release.xcconfig"

if [ -f "$PODS_XCCONFIG" ]; then
  echo "CocoaPods configuration already exists"
  exit 0
fi

if ! command -v npm >/dev/null 2>&1; then
  if command -v brew >/dev/null 2>&1; then
    echo "Installing Node.js"
    brew install node
  else
    echo "npm is unavailable and Homebrew was not found on PATH"
    exit 1
  fi
fi

if [ ! -d node_modules ]; then
  echo "Installing JavaScript dependencies"
  npm ci
fi

echo "Building web assets"
npm run build

echo "Copying Capacitor assets to iOS"
npx cap copy ios

echo "CocoaPods configuration is missing; installing iOS Pods"
cd "$REPO_ROOT/ios/App"
pod install

if [ ! -f "$REPO_ROOT/$PODS_XCCONFIG" ]; then
  echo "Expected CocoaPods configuration was not created: $PODS_XCCONFIG"
  exit 1
fi
