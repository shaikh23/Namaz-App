#!/bin/sh
set -e

PODS_XCCONFIG="ios/App/Pods/Target Support Files/Pods-App/Pods-App.release.xcconfig"

if [ -f "$PODS_XCCONFIG" ]; then
  echo "CocoaPods configuration already exists"
  exit 0
fi

echo "CocoaPods configuration is missing; installing iOS Pods"
cd ios/App
pod install
