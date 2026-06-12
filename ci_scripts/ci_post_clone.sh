#!/bin/sh
set -e

echo "Installing JavaScript dependencies"
npm ci

echo "Building web assets"
npm run build

echo "Copying Capacitor assets to iOS"
npx cap copy ios

echo "Installing CocoaPods dependencies"
cd ios/App
pod install
