# 📱 TikTok Clone - React Native

A TikTok clone app built with React Native, featuring a modern UI inspired by Figma design channel aopzqj84.

## 🚀 Features

- ✨ Full-screen video feed with swipe navigation
- ❤️ Like, comment, and share functionality
- 🎨 Custom SVG icons matching Figma design
- 📱 Bottom tab navigation (Home, Discover, Upload, Inbox, Me)
- 🎬 Video playback with pause/play on tap
- 🌈 TikTok-style upload button with gradient effect

## 🛠 Tech Stack

- **React Native** 0.75.4
- **Supabase** - Backend (Database, Auth, Storage)
- **react-native-svg** - Vector graphics
- **react-navigation** - Navigation
- **react-native-video** - Video player
- **react-native-vector-icons** - Icon support

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/jung-wan-kim/app-forge-react-native.git
cd app-forge-react-native

# Install dependencies
npm install

# iOS specific
cd ios && pod install && cd ..

# Run the app
npm run ios  # for iOS
npm run android  # for Android
```

## 🎨 Design

All UI components are implemented based on Figma channel aopzqj84, featuring:
- Custom SVG icons for all navigation items
- TikTok-style gradient upload button
- Avatar components with internal objects
- Proper typography and spacing

## 📱 Screens

1. **Home** - Video feed with full-screen playback
2. **Discover** - Search and trending content
3. **Upload** - Create new content
4. **Inbox** - Messages and notifications
5. **Me** - User profile

## 🔧 Configuration

Create a `.env` file with your Supabase credentials:

```env
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 🤝 Contributing

Feel free to open issues and pull requests!

## 📄 License

MIT License

---

Built with ❤️ using React Native