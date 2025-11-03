# VultraDrop Setup Guide

## 🚀 Quick Start

VultraDrop is now fully configured and ready to run! Follow these steps to get started.

## ✅ What's Already Done

- ✅ All dependencies installed
- ✅ TypeScript configuration complete
- ✅ Build verified and working
- ✅ All components created
- ✅ Environment file template created

## 🔑 Required: API Keys Configuration

Before running the application, you **MUST** add your API keys to the `.env` file:

### 1. Get Your API Keys

#### Google Gemini API Key
1. Visit [Google AI Studio](https://makersuite.google.com/)
2. Sign in with your Google account
3. Create a new API key
4. Copy the key

#### ElevenLabs API Key
1. Visit [ElevenLabs](https://elevenlabs.io/)
2. Sign up or log in
3. Go to your profile settings
4. Find your API key in the API section
5. Copy the key

### 2. Update the `.env` File

Open the `.env` file in the project root and replace the placeholder values:

```env
# Google Gemini API Key (used for script generation and Imagen 4.0 image generation)
GEMINI_API_KEY=your_actual_gemini_api_key_here

# ElevenLabs API Key (used for text-to-speech narration)
ELEVENLABS_API_KEY=your_actual_elevenlabs_api_key_here
```

⚠️ **IMPORTANT**: Never commit your `.env` file to version control. It's already in `.gitignore`.

## 🎬 Running the Application

### Development Mode

```bash
npm run dev
```

This will start the Vite development server on `http://localhost:3000`

### Production Build

```bash
npm run build
```

This creates an optimized production build in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

This serves the production build locally for testing.

## 🎨 Features

### Genesis Sequence
- On first load, you'll see an animated "VULTRA DROP" genesis sequence
- Click "AWAKEN" to enter the main interface

### Interactive Layers
Navigate through different visualization layers using the HUD at the bottom:
- 🌳 **Raindrop (The Garden)**: Self-evolving agent visualization
- 🌐 **Vultr (The Sinew)**: Global network visualization
- 🗣️ **ElevenLabs (The Voice)**: Audio waveform visualization
- 🧠 **Gemini/Cerebras (The Mind)**: Neural network visualization

### Creative Hyperverse
Click the film icon (🎬) to access the Creative Hyperverse:
1. Enter your creative vision (e.g., "An epic space opera about a lone astronaut")
2. Select aspect ratio for generated images
3. Click "MANIFEST" to generate:
   - A 10-scene narrative script
   - Cinematic images for each scene (4 images per scene)
   - AI-generated narration for each scene
   - Thematic background music
4. Click "Play Trailer" to experience your cinematic creation

### Theme Switching
Use the theme switcher in the top-right corner to change visual themes:
- **Nebula** (default): Blue/cyan cosmic theme
- **Cyberpunk**: Pink/yellow neon theme
- **Biosynth**: Green/teal organic theme
- **Starlight**: Gray/white minimalist theme

## 📁 Project Structure

```
/vercel/sandbox/
├── components/          # React components
│   ├── visualizations/  # Layer visualization components
│   ├── LiveSystem.tsx   # Main system orchestrator
│   ├── CreativeHyperverse.tsx  # Trailer generation UI
│   └── ...
├── hooks/              # Custom React hooks
│   ├── useManifestationEngine.ts  # Content generation logic
│   └── useCinematicPlayer.ts      # Playback control logic
├── services/           # API service layers
│   ├── geminiService.ts       # Gemini API integration
│   ├── elevenLabsService.ts   # ElevenLabs API integration
│   └── musicService.ts        # Music selection logic
├── contexts/           # React contexts
│   └── ThemeContext.tsx
├── types.ts           # TypeScript type definitions
├── config.ts          # Configuration constants
├── .env              # Environment variables (API keys)
└── index.html        # Entry HTML file
```

## 🛠️ Troubleshooting

### Build Errors
If you encounter build errors:
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
npm run build
```

### API Errors
- **"API Key not found"**: Ensure your `.env` file has valid API keys
- **"Quota exceeded"**: Check your API usage limits on the respective platforms
- **"API key not valid"**: Verify your API keys are correct and active

### Performance Issues
- The genesis animation is GPU-intensive; it should complete in ~5 seconds
- Image generation takes 10-30 seconds per scene depending on API response time
- Narration generation is typically fast (2-5 seconds per scene)

## 🎯 Usage Tips

1. **Vision Prompts**: Be specific and descriptive. Good examples:
   - "A cyberpunk detective story set in a neon-lit Tokyo"
   - "An underwater adventure discovering ancient ruins"
   - "A space western on Mars with robot cowboys"

2. **Aspect Ratios**:
   - `16:9` - Widescreen (best for desktop viewing)
   - `1:1` - Square (social media friendly)
   - `9:16` - Vertical (mobile/stories)
   - `4:3` - Classic (retro feel)

3. **Performance**: Generation of all 10 scenes happens in parallel, so total time is ~30-60 seconds regardless of scene count

## 📝 Notes

- The application uses Vite's import map feature for React dependencies
- All visualizations are canvas/SVG-based for optimal performance
- Audio playback uses the Web Audio API
- Images are returned as base64 data URLs for immediate display

## 🎉 You're Ready!

Once you've added your API keys, run `npm run dev` and experience the future of creative manifestation!

For more details about the vision and architecture, see the main [README.md](./README.md).
