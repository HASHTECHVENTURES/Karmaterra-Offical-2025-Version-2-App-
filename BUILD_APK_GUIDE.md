# 📱 How to Build Your KarmaTerra APK

## ✅ Status: Build Ready!

Your app has been successfully built and synced with Android! 🎉

---

## 🚀 Option 1: Build APK with Android Studio (EASIEST)

### **Step 1: Open Project in Android Studio**

```bash
# Open Android Studio
# Then: File → Open
# Navigate to: /Users/sujalpatel/Documents/karmaterra offical App/KARMATERRA-OFFICAL-2025-APP/android
```

**Or use terminal:**
```bash
cd "/Users/sujalpatel/Documents/karmaterra offical App/KARMATERRA-OFFICAL-2025-APP"
npm run cap:open:android
```

### **Step 2: Build Debug APK**

In Android Studio:
1. Click **Build** → **Build Bundle(s) / APK(s)** → **Build APK(s)**
2. Wait for build to complete (2-5 minutes)
3. Click **locate** in the notification popup

**APK Location:**
```
/Users/sujalpatel/Documents/karmaterra offical App/KARMATERRA-OFFICAL-2025-APP/android/app/build/outputs/apk/debug/app-debug.apk
```

### **Step 3: Install on Device**

**Option A: USB Cable**
1. Connect Android phone via USB
2. Enable USB Debugging on phone
3. In Android Studio, click ▶️ Run button
4. Select your device
5. App installs automatically!

**Option B: Share APK File**
1. Copy `app-debug.apk` to your phone
2. Open file on phone
3. Tap "Install"
4. Done!

---

## 🏗️ Option 2: Build APK with Command Line

### **Prerequisites:**

**Install Java (Required):**
```bash
# Install via Homebrew
brew install openjdk@17

# Or download from:
# https://www.oracle.com/java/technologies/downloads/#java17
```

**Set JAVA_HOME:**
```bash
export JAVA_HOME=/usr/local/opt/openjdk@17/libexec/openjdk.jdk/Contents/Home
export PATH="$JAVA_HOME/bin:$PATH"
```

### **Build Commands:**

**Debug APK (No Signing Required):**
```bash
cd "/Users/sujalpatel/Documents/karmaterra offical App/KARMATERRA-OFFICAL-2025-APP/android"
./gradlew assembleDebug
```

**Output:**
```
android/app/build/outputs/apk/debug/app-debug.apk
```

**Release APK (For Play Store - Requires Signing):**
```bash
cd "/Users/sujalpatel/Documents/karmaterra offical App/KARMATERRA-OFFICAL-2025-APP/android"
./gradlew assembleRelease
```

**Output:**
```
android/app/build/outputs/apk/release/app-release-unsigned.apk
```

---

## 📦 Option 3: Build App Bundle (For Google Play Store)

App Bundle (.aab) is **required** for Play Store submission:

### **In Android Studio:**
1. **Build** → **Generate Signed Bundle / APK**
2. Select **Android App Bundle**
3. Click **Next**
4. Create or select keystore
5. Click **Finish**

### **Via Command Line:**
```bash
cd "/Users/sujalpatel/Documents/karmaterra offical App/KARMATERRA-OFFICAL-2025-APP/android"
./gradlew bundleRelease
```

**Output:**
```
android/app/build/outputs/bundle/release/app-release.aab
```

---

## 🔐 App Signing (Required for Release)

### **Generate Keystore:**

```bash
keytool -genkey -v -keystore karmaterra-release.jks \
  -alias karmaterra-key \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000
```

**Save these details securely:**
- Keystore password
- Key alias: karmaterra-key
- Key password

### **Configure Signing in Android Studio:**

1. **Build** → **Generate Signed Bundle / APK**
2. Select **Android App Bundle** or **APK**
3. Click **Create new keystore**
4. Fill in details:
   - Key store path: Choose location
   - Password: Create strong password
   - Alias: karmaterra-key
   - Validity: 25+ years
5. Fill in certificate details:
   - First and Last Name: Your Name
   - Organization: HashTech Ventures
   - City: Your City
   - State: Your State
   - Country: Your Country
6. Click **OK** and **Finish**

**⚠️ IMPORTANT:** Backup your keystore file! If you lose it, you cannot update your app on Play Store!

---

## 📱 Quick Build & Install Guide

### **Fastest Way to Test:**

```bash
# 1. Build the app
cd "/Users/sujalpatel/Documents/karmaterra offical App/KARMATERRA-OFFICAL-2025-APP"
npm run build

# 2. Sync with Android
npx cap sync android

# 3. Open in Android Studio
npm run cap:open:android

# 4. In Android Studio: Run ▶️ (or Build → Build APK)
```

---

## 📂 APK File Locations

### **Debug APK** (For Testing):
```
android/app/build/outputs/apk/debug/app-debug.apk
```
- Size: ~30-40 MB
- Install anywhere
- No signing needed
- For testing only

### **Release APK** (Signed):
```
android/app/build/outputs/apk/release/app-release.apk
```
- Size: ~20-30 MB (optimized)
- Requires signing
- For distribution

### **App Bundle** (For Play Store):
```
android/app/build/outputs/bundle/release/app-release.aab
```
- Size: ~25-35 MB
- Requires signing
- Upload to Play Store
- Google optimizes for each device

---

## 🎯 APK vs AAB - Which to Use?

### **APK (Android Package)**
- ✅ Can install directly on any device
- ✅ Easy to share and test
- ✅ Works without Play Store
- ❌ Larger file size
- ❌ Not optimized per device
- ❌ Cannot publish to Play Store (since Aug 2021)

**Use for:** Testing, side-loading, beta testing

### **AAB (Android App Bundle)**
- ✅ Required for Play Store
- ✅ Smaller downloads (device-specific)
- ✅ Optimized by Google
- ✅ Better performance
- ❌ Cannot install directly
- ❌ Must go through Play Store

**Use for:** Play Store submission, production release

---

## 🔍 Verify Your APK

### **Check APK Info:**
```bash
# Install bundletool (one time)
brew install bundletool

# Get APK info
bundletool dump manifest --apk=app-debug.apk

# Check APK size
ls -lh app-debug.apk
```

### **Test APK on Device:**
```bash
# Install via ADB
adb install app-debug.apk

# Uninstall if needed
adb uninstall com.hashtechventures.karmaterra

# View logs while testing
adb logcat | grep KarmaTerra
```

---

## 🐛 Troubleshooting

### **Error: Java Not Found**
**Solution:**
```bash
brew install openjdk@17
export JAVA_HOME=/usr/local/opt/openjdk@17/libexec/openjdk.jdk/Contents/Home
```

### **Error: Android SDK Not Found**
**Solution:** Install Android Studio, then set:
```bash
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools
```

### **Error: Build Failed**
**Solution:**
```bash
# Clean build
cd android
./gradlew clean
./gradlew assembleDebug

# Or in Android Studio
# Build → Clean Project
# Build → Rebuild Project
```

### **Error: App Not Installing**
**Solution:**
```bash
# Enable USB Debugging on phone
# Settings → About Phone → Tap "Build Number" 7 times
# Settings → Developer Options → Enable USB Debugging

# Allow installation from unknown sources
# Settings → Security → Unknown Sources → Enable
```

---

## 📊 Your Current Build Status

✅ **Web App:** Built successfully (10 chunks, optimized)  
✅ **Capacitor:** Synced with Android  
✅ **Android Project:** Ready to build  
✅ **Icons:** Configured  
✅ **Permissions:** Set  
✅ **Safe Areas:** Implemented  
✅ **ProGuard:** Configured  
✅ **Network Security:** Configured  

**What's Ready:**
- Debug APK: Can build now
- Release APK: Needs signing
- App Bundle: Needs signing
- Play Store: Ready (after signing)

---

## 🎉 Next Steps

### **For Testing (Immediate):**
1. Open Android Studio
2. Build → Build APK(s)
3. Install on your phone
4. Test all features!

### **For Production (Play Store):**
1. Generate release keystore
2. Build signed app bundle
3. Create Play Console account
4. Upload AAB file
5. Fill in store listing
6. Submit for review!

---

## 📱 Quick Commands Cheat Sheet

```bash
# Full build process
npm run build && npx cap sync android

# Open in Android Studio
npm run cap:open:android

# Build debug APK (terminal)
cd android && ./gradlew assembleDebug

# Build release bundle (terminal)
cd android && ./gradlew bundleRelease

# Install on connected device
adb install app-debug.apk

# View app logs
adb logcat | grep -i karmaterra
```

---

## 🎊 Congratulations!

Your KarmaTerra app is built and ready to install! 

**APK will be at:**
```
/Users/sujalpatel/Documents/karmaterra offical App/KARMATERRA-OFFICAL-2025-APP/android/app/build/outputs/apk/debug/app-debug.apk
```

Open Android Studio and click **Build → Build APK(s)** to generate it! 🚀

---

**Need help?** Check the troubleshooting section or open Android Studio for visual guidance.

**Ready for Play Store?** Follow the "Build App Bundle" section above.

**Your app is production-ready!** 🎉📱

