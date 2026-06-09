# keytype - Typing Test

A minimal typing test web application inspired by Monkeytype, built with modern web technologies.

## 🛠️ Technologies Used

### Core Framework
- **Next.js 16** - React framework for production with built-in routing and server-side rendering
- **React 19** - UI library for building interactive components with hooks
- **TypeScript 5** - Superset of JavaScript providing static type checking and better IDE support

### Styling & UI
- **Tailwind CSS 4** - Utility-first CSS framework for rapid UI development
- **PostCSS 4** - Tool for transforming CSS with JavaScript plugins

### Development Tools
- **ESLint 9** - JavaScript linter for code quality, consistency, and best practices
- **Node.js** - JavaScript runtime environment

## 📋 Features

- Multiple timer modes (15, 30, 60, 120 seconds)
- Real-time WPM (Words Per Minute) calculation
- Accuracy tracking with detailed statistics
- Visual feedback for correct/incorrect characters
- Smooth animations and transitions
- Dark theme optimized for typing practice
- Monospace font for better character distinction
- Responsive design for different screen sizes
- Keyboard-driven interface

## 🚀 Getting Started

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```
The app will be available at `http://localhost:3000`

### Build for Production
```bash
npm run build
npm start
```

### Code Quality
```bash
npm run lint
```

## 📁 Project Structure

```
src/
├── app/                  # Next.js app directory
│   ├── page.tsx         # Home page component
│   ├── layout.tsx       # Root layout wrapper
│   └── globals.css      # Global styles & Tailwind imports
├── components/          # React components
│   ├── TypingTest.tsx   # Main typing test logic & rendering
│   ├── Header.tsx       # Header with timer mode controls
│   └── Results.tsx      # Test results display
├── data/                # Static data (word lists)
└── utils/               # Utility functions (calculations)
```

## 🎯 How It Works

1. **Start**: Click to start typing - the timer begins automatically on first key press
2. **Type**: Characters are tracked and colored based on accuracy
3. **Visual Feedback**:
   - 🟢 **Green** - Correct characters
   - 🔴 **Red** - Incorrect characters
   - 🟡 **Yellow** - Current cursor position
4. **Results**: After time runs out, see your WPM, accuracy, and detailed statistics
5. **Restart**: Press Tab or click "Next test" to restart with new words

## 🎨 Color Scheme

| Element | Color | Hex |
|---------|-------|-----|
| Background | Dark Gray | `#1e1e1e` |
| Primary Accent | Gold | `#e2b714` |
| Main Text | Light Gray | `#d1d0c5` |
| Correct Text | Green | `#3dd68c` |
| Incorrect Text | Red | `#ca4754` |
| Secondary Text | Medium Gray | `#646669` |

## ⌨️ Keyboard Shortcuts

- **Any key** - Start typing (begins test)
- **Tab** - Restart test
- **Backspace** - Delete previous character

