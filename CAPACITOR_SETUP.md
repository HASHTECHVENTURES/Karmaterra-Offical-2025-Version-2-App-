# Capacitor.js Setup Guide for KarmaTerra

## ✅ Installation Complete

Capacitor has been successfully installed and configured for your KarmaTerra app!

### 📦 Installed Packages

**Core Packages:**
- `@capacitor/core` - Core Capacitor functionality
- `@capacitor/cli` - Capacitor CLI tools

**Platform Packages:**
- `@capacitor/android` - Android platform support
- `@capacitor/ios` - iOS platform support (requires Xcode)

**Plugin Packages:**
- `@capacitor/camera` - Camera access for photo capture
- `@capacitor/filesystem` - File system access
- `@capacitor/preferences` - Local storage/preferences
- `@capacitor/splash-screen` - Splash screen control
- `@capacitor/status-bar` - Status bar customization
- `@capacitor/share` - Native share functionality

---

## 🔧 Configuration

### capacitor.config.ts
```typescript
{
  appId: 'com.hashtechventures.karmaterra',
  appName: 'KarmaTerra',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    iosScheme: 'https'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#ffffff',
      showSpinner: true,
      spinnerColor: '#22c55e'
    },
    StatusBar: {
      style: 'light',
      backgroundColor: '#22c55e'
    }
  }
}
```

---

## 🚀 Available NPM Scripts

```bash
# Build and sync with native platforms
npm run cap:sync

# Open iOS project in Xcode
npm run cap:open:ios

# Open Android project in Android Studio
npm run cap:open:android

# Build and run on iOS device/simulator
npm run cap:run:ios

# Build and run on Android device/emulator
npm run cap:run:android
```

---

## 📱 Platform Setup

### Android ✅
- **Status:** Successfully added
- **Location:** `/android` folder
- **Requirements:** Android Studio
- **To Run:**
  ```bash
  npm run cap:open:android
  ```

### iOS ⚠️
- **Status:** Partially added (requires Xcode)
- **Location:** `/ios` folder
- **Requirements:** 
  - macOS with Xcode installed
  - CocoaPods installed (`sudo gem install cocoapods`)
- **To Complete Setup:**
  ```bash
  cd ios/App
  pod install
  ```
- **To Run:**
  ```bash
  npm run cap:open:ios
  ```

---

## 🛠️ Development Workflow

### 1. Make Changes to Your Web App
Edit your React components as usual in the `src/` folder.

### 2. Build Your App
```bash
npm run build
```

### 3. Sync with Native Platforms
```bash
npx cap sync
```
This copies your web app to native platforms and updates plugins.

### 4. Open in Native IDE
**For Android:**
```bash
npm run cap:open:android
```

**For iOS:**
```bash
npm run cap:open:ios
```

### 5. Run on Device/Emulator
Use Android Studio or Xcode to run your app, or use:
```bash
npm run cap:run:android
# or
npm run cap:run:ios
```

---

## 📸 Using Capacitor Plugins in Your Code

### Camera Plugin Example
```typescript
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

const takePicture = async () => {
  const image = await Camera.getPhoto({
    quality: 90,
    allowEditing: false,
    resultType: CameraResultType.Uri,
    source: CameraSource.Camera
  });
  
  const imageUrl = image.webPath;
  // Use imageUrl in your app
};
```

### Filesystem Plugin Example
```typescript
import { Filesystem, Directory } from '@capacitor/filesystem';

const saveFile = async (data: string) => {
  await Filesystem.writeFile({
    path: 'myfile.txt',
    data: data,
    directory: Directory.Documents
  });
};
```

### Share Plugin Example
```typescript
import { Share } from '@capacitor/share';

const shareReport = async () => {
  await Share.share({
    title: 'My Skin Analysis Report',
    text: 'Check out my skin analysis!',
    url: 'https://example.com/report',
    dialogTitle: 'Share Report'
  });
};
```

---

## ⚙️ Environment-Specific Code

Use Capacitor's platform detection:

```typescript
import { Capacitor } from '@capacitor/core';

if (Capacitor.isNativePlatform()) {
  // Running on iOS or Android
  console.log('Running on:', Capacitor.getPlatform());
} else {
  // Running in web browser
  console.log('Running on web');
}
```

---

## 🔐 Permissions

### Android Permissions
Edit `android/app/src/main/AndroidManifest.xml` to add:
```xml
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
```

### iOS Permissions
Edit `ios/App/App/Info.plist` to add:
```xml
<key>NSCameraUsageDescription</key>
<string>We need camera access to capture your skin photos</string>
<key>NSPhotoLibraryUsageDescription</key>
<string>We need photo library access to select images</string>
```

---

## 📦 Building for Production

### Android APK/AAB
1. Open Android Studio
2. Build → Generate Signed Bundle/APK
3. Follow the signing wizard

### iOS IPA
1. Open Xcode
2. Product → Archive
3. Upload to App Store Connect

---

## 🐛 Troubleshooting

### iOS Issues
**CocoaPods not installed:**
```bash
sudo gem install cocoapods
cd ios/App
pod install
```

**Xcode not found:**
Install Xcode from the Mac App Store and run:
```bash
sudo xcode-select --switch /Applications/Xcode.app
```

### Android Issues
**Gradle build failed:**
```bash
cd android
./gradlew clean
cd ..
npx cap sync android
```

---

## 📚 Additional Resources

- [Capacitor Documentation](https://capacitorjs.com/docs)
- [Capacitor Plugins](https://capacitorjs.com/docs/plugins)
- [Capacitor Community Plugins](https://github.com/capacitor-community)
- [iOS Developer Guide](https://capacitorjs.com/docs/ios)
- [Android Developer Guide](https://capacitorjs.com/docs/android)

---

## 🎯 Next Steps

1. ✅ Capacitor is installed
2. ⏭️ Install Xcode (for iOS development)
3. ⏭️ Install Android Studio (for Android development)
4. ⏭️ Update PhotoCapture component to use Capacitor Camera
5. ⏭️ Test on real devices
6. ⏭️ Configure app icons and splash screens
7. ⏭️ Set up code signing for distribution

---

**Built with ❤️ for KarmaTerra by HashTech Ventures**

