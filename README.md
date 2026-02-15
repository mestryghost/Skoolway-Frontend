# Skoolway

React Native app with **mobile** (iOS/Android) and **web** from one codebase. Built with Expo.

## Structure

```
Skoolway/
├── App.js                 # Entry component → src/app
├── index.js               # Registers app with Expo
├── src/
│   ├── app/               # App shell, layout, root
│   ├── components/        # Shared UI components
│   ├── screens/           # Full-screen views
│   ├── hooks/             # Shared hooks (e.g. usePlatform)
│   ├── utils/             # Helpers
│   ├── constants/         # App constants
│   └── theme/             # Colors, typography, spacing
├── assets/                # Images, fonts
└── app.json               # Expo config (name, web, ios, android)
```

- **Shared code**: Use `src/` for everything that runs on all platforms.
- **Platform-specific**: Use file suffixes so the bundler picks the right one:
  - `Component.web.js` – web only  
  - `Component.ios.js` / `Component.android.js` – native only  
  - `Component.js` – fallback (e.g. shared).
- **Runtime checks**: Use `Platform.OS === 'web'` or the `usePlatform()` hook when you need small branches.

## Run

Install once (if not already):

```bash
npm install
```

Then:

| Target   | Command           |
|----------|-------------------|
| All      | `npm start`       |
| Web      | `npm run web`     |
| Android  | `npm run android` |
| iOS      | `npm run ios`     |

- **Web**: Opens in the browser (Expo’s default port).
- **Mobile**: Use Expo Go on a device or an emulator/simulator; scan the QR code from the terminal.

## Build for production

- **Web**: `npx expo export --platform web` → output in `dist/`.
- **Mobile**: Use [EAS Build](https://docs.expo.dev/build/introduction/) for iOS/Android binaries.

You’re set to build the mobile app and website in one place.
