# Namaz - Islamic Prayer Times iOS App

## Project Overview

A simple iOS app that displays the five daily Islamic prayer times (Fajr, Dhuhr, Asr, Maghrib, Isha) based on the user's location. The app calculates prayer times locally using astronomical calculations with no backend dependency.

## MVP Objectives

**Core Goal:** Build the simplest working version that shows today's prayer times.

### MVP Features (Must Have)
- ✓ Display today's 5 prayer times
- ✓ Calculate times based on location (manual coordinates)
- ✓ Basic settings for calculation method
- ✓ Clean, simple SwiftUI interface

### Post-MVP Features (Future)
- Notifications before each prayer
- Automatic location detection (CoreLocation)
- Home screen widget
- Qibla compass
- Prayer history tracking
- Multiple adhan sounds
- Calendar view

## Technology Stack

### Primary Technologies
- **Language:** Swift 5.9+
- **UI Framework:** SwiftUI
- **IDE:** VS Code (editing) + Xcode (building/running)
- **Minimum iOS Version:** iOS 15.0+

### Dependencies
- **Adhan Swift** - Prayer time calculations
  - Repository: `https://github.com/batoulapps/adhan-swift`
  - Installation: Swift Package Manager

### Development Tools
- **VS Code Extensions:**
  - Swift (sswg.swift-lang) - Language support
  - CodeLLDB (optional) - Debugging

- **MCP Servers:**
  - `@modelcontextprotocol/server-filesystem` - File operations
  - `@modelcontextprotocol/server-git` - Version control

## Project Structure

```
namaz/
├── README.md                           # This file
├── Namaz.xcodeproj/                   # Xcode project
├── Namaz/
│   ├── NamazApp.swift                 # App entry point
│   ├── ContentView.swift              # Main prayer times display
│   ├── SettingsView.swift             # Settings screen
│   ├── PrayerCalculator.swift         # Prayer time calculation logic
│   ├── Assets.xcassets/               # Images and icons
│   └── Info.plist                     # App configuration
├── .vscode/
│   └── settings.json                  # VS Code + MCP configuration
└── .gitignore                         # Git ignore rules
```

## Setup Instructions

### Step 1: Prerequisites
- macOS with Xcode installed (required for iOS development)
- VS Code installed
- Node.js/npm installed (for MCP servers)

### Step 2: Create Xcode Project
1. Open Xcode
2. Create new project: File → New → Project
3. Select "App" under iOS
4. Configuration:
   - Product Name: `Namaz`
   - Interface: `SwiftUI`
   - Language: `Swift`
   - Storage: `None`
5. Save to `/home/wner/projects/namaz`

### Step 3: Add Adhan Library
1. In Xcode: File → Add Package Dependencies
2. Enter URL: `https://github.com/batoulapps/adhan-swift`
3. Select latest version
4. Add to target: `Namaz`

### Step 4: Initialize Git
```bash
cd /home/wner/projects/namaz
git init
git add .
git commit -m "Initial commit: Xcode project setup"
```

### Step 5: Configure VS Code
Create `.vscode/settings.json`:
```json
{
  "mcp.servers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/home/wner/projects/namaz"]
    },
    "git": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-git", "--repository", "/home/wner/projects/namaz"]
    }
  }
}
```

### Step 6: Install Swift Extension
In VS Code:
1. Open Extensions (Cmd+Shift+X)
2. Search for "Swift" by Swift Server Work Group
3. Install

## Development Steps

### Phase 1: Core Prayer Calculator

**File:** `PrayerCalculator.swift`

**Objectives:**
- Import Adhan library
- Create function to calculate prayer times from coordinates
- Support multiple calculation methods (ISNA, MWL, Egyptian, etc.)
- Return array of prayer times with names

**Key Implementation:**
```swift
import Adhan

struct PrayerCalculator {
    static func calculateTimes(
        latitude: Double, 
        longitude: Double, 
        method: CalculationMethod
    ) -> [Prayer] {
        // Use Adhan library to calculate times
        // Return array of 5 prayers with times
    }
}
```

### Phase 2: Main Display View

**File:** `ContentView.swift`

**Objectives:**
- Create simple list showing 5 prayer times
- Display prayer name and time
- Format times in readable format (e.g., "1:23 PM")
- Add navigation to settings

**UI Structure:**
- NavigationView with title "Prayer Times"
- List of 5 prayers (Fajr, Dhuhr, Asr, Maghrib, Isha)
- Each row shows prayer name and time
- Settings button in toolbar

### Phase 3: Settings View

**File:** `SettingsView.swift`

**Objectives:**
- Picker for calculation method
- Text fields for manual latitude/longitude entry
- Save preferences to UserDefaults
- Trigger recalculation when settings change

**Settings to Include:**
- Calculation Method dropdown (ISNA, MWL, Egyptian, Makkah, Karachi)
- Latitude (decimal degrees)
- Longitude (decimal degrees)

### Phase 4: App Entry Point

**File:** `NamazApp.swift`

**Objectives:**
- Configure app lifecycle
- Set ContentView as root view
- Handle initial launch

### Phase 5: Testing

**Testing Checklist:**
- [ ] Prayer times calculate correctly for test coordinates
- [ ] Times update when location changes in settings
- [ ] Different calculation methods produce different times
- [ ] App runs in simulator without crashes
- [ ] UI is readable and navigable

**Test Locations:**
- New York: 40.7128°N, 74.0060°W
- Mecca: 21.4225°N, 39.8262°E
- London: 51.5074°N, 0.1278°W

## Building and Running

### Using Xcode
1. Open `Namaz.xcodeproj` in Xcode
2. Select iPhone simulator from device menu
3. Press Cmd+R or click Play button

### Using Terminal (from project directory)
```bash
# Build
xcodebuild -scheme Namaz -destination 'platform=iOS Simulator,name=iPhone 15'

# Run in simulator
open /Applications/Xcode.app/Contents/Developer/Applications/Simulator.app
xcodebuild -scheme Namaz -destination 'platform=iOS Simulator,name=iPhone 15' test
```

## Calculation Methods Reference

| Method | Region | Fajr Angle | Isha Angle |
|--------|--------|------------|------------|
| ISNA | North America | 15° | 15° |
| MWL | Muslim World League | 18° | 17° |
| Egyptian | Egypt | 19.5° | 17.5° |
| Makkah | Umm al-Qura | 18.5° | 90 min after Maghrib |
| Karachi | University of Karachi | 18° | 18° |

## Git Workflow

```bash
# Feature development
git checkout -b feature/prayer-calculator
# Make changes
git add .
git commit -m "Add prayer time calculator"
git checkout main
git merge feature/prayer-calculator

# Regular commits
git add .
git commit -m "Descriptive message"
git push origin main
```

## Troubleshooting

### Build Errors
- Ensure Adhan package is properly added to project
- Check Swift version compatibility (5.9+)
- Clean build folder: Product → Clean Build Folder in Xcode

### Prayer Time Issues
- Verify coordinates are in decimal degrees format
- Check that date/time is correct
- Try different calculation methods

### Simulator Issues
- Reset simulator: Device → Erase All Content and Settings
- Restart Xcode
- Check macOS has sufficient resources

## Next Steps After MVP

1. **Automatic Location** - Add CoreLocation for GPS-based prayer times
2. **Notifications** - Schedule local notifications before each prayer
3. **Widget** - iOS home screen widget showing next prayer
4. **Polish** - App icon, launch screen, better UI design
5. **App Store** - Prepare for submission (screenshots, description, etc.)

## Resources

- [Adhan Swift Documentation](https://github.com/batoulapps/adhan-swift)
- [SwiftUI Tutorials](https://developer.apple.com/tutorials/swiftui)
- [Islamic Prayer Times Calculation](https://en.wikipedia.org/wiki/Islamic_calendar#Prayer_times)
- [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)

## License

TBD

## Notes

- This is an MVP focused on simplicity and core functionality
- Backend/API integration planned for post-MVP
- Focus on getting a working app first, then iterate
