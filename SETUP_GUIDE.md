# VultraDrop Setup Guide

## Fixed Issues

The application has been completely refactored and is now fully functional. Here's what was fixed:

### 1. Environment Variable Handling
- **Problem**: API keys weren't being loaded properly from environment variables
- **Fix**: Updated to use Vite's `import.meta.env` with `VITE_` prefix
- **Files Changed**:
  - `services/geminiService.ts`
  - `services/elevenLabsService.ts`
  - `vite.config.ts`
  - `.env` and `.env.example`

### 2. API Service Initialization
- **Problem**: Services were trying to use `process.env` directly, which doesn't work in Vite
- **Fix**: Created `getApiKey()` functions that properly access environment variables
- **Result**: Clear error messages when API keys are not configured

### 3. Error Handling
- **Problem**: Errors weren't being caught and displayed properly
- **Fix**: Added comprehensive try-catch blocks with user-friendly error messages
- **Result**: Users see clear feedback when something goes wrong

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure API Keys
Edit the `.env` file and add your API keys:

```env
VITE_GEMINI_API_KEY=your_actual_gemini_api_key
VITE_ELEVENLABS_API_KEY=your_actual_elevenlabs_api_key
```

#### Getting API Keys:

**Google Gemini API Key:**
1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Click "Get API Key"
3. Create a new API key or use an existing one
4. Copy the key to your `.env` file

**ElevenLabs API Key:**
1. Go to [ElevenLabs](https://elevenlabs.io/)
2. Sign up or log in
3. Go to your Profile Settings
4. Find "API Key" section
5. Copy your API key to the `.env` file

### 3. Start the Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:3000/`

### 4. Build for Production
```bash
npm run build
```

## How to Use the Application

### 1. Genesis Sequence
When you first open the app, you'll see the Genesis animation sequence. This is the awakening of the VultraDrop lifeform.

### 2. Navigation
After Genesis completes, you can navigate through different layers:
- **Arrow Keys**: Navigate between layers (Raindrop, Vultr, ElevenLabs, Cerebras/Gemini)
- **Press H**: Open the Creative Hyperverse
- **Press G**: Open the Showcase Gallery
- **HUD Buttons**: Click the icons at the bottom of the screen

### 3. Creative Hyperverse (The Main Feature)
This is where the magic happens:

1. Click the **Film Icon** button or press **H**
2. Enter your creative vision (e.g., "An epic space opera about a lone astronaut discovering a lost alien civilization")
3. Select your preferred aspect ratio (16:9, 1:1, 9:16, 4:3, 3:4)
4. Click **MANIFEST**

The system will:
- Generate a 10-scene narrative script using Gemini AI
- Create cinematic images for each scene using Imagen
- Generate voice narration for each scene using ElevenLabs
- Compose background music
- Assemble everything into a playable cinematic trailer

5. Once generation is complete, click **Play Trailer** to watch your vision come to life

## Troubleshooting

### "API Key not configured" Error
- Make sure your `.env` file has the correct variable names with `VITE_` prefix
- Make sure you've replaced `your_gemini_api_key_here` with your actual API key
- Restart the development server after changing `.env`

### "API quota exceeded" Error
- You've hit your API usage limit
- Check your billing and quota in Google AI Studio or ElevenLabs dashboard
- Wait for the quota to reset or upgrade your plan

### Images Not Generating
- Check your Gemini API key has access to Imagen models
- Some prompts may be filtered by content policies
- Try a different, more specific prompt

### Narration Not Playing
- Check your ElevenLabs API key is valid
- Check your browser's audio permissions
- Check the browser console for detailed error messages

### Server Won't Start
- Make sure port 3000 is not already in use
- Try running `npm install` again
- Check for any TypeScript errors in the console

## Architecture Overview

The application is built with:
- **React 19** for the UI
- **TypeScript** for type safety
- **Vite** for fast development and building
- **Google Gemini API** for script generation and image generation (Imagen)
- **ElevenLabs API** for voice synthesis
- **Custom React Hooks** for state management

### Key Files:
- `services/geminiService.ts` - Handles Gemini API calls
- `services/elevenLabsService.ts` - Handles ElevenLabs API calls
- `hooks/useManifestationEngine.ts` - Orchestrates the entire generation process
- `hooks/useCinematicPlayer.ts` - Manages playback of the generated trailer
- `components/CreativeHyperverse.tsx` - Main UI for the manifestation feature
- `components/LiveSystem.tsx` - Main app component with navigation

## Performance Notes

- Each manifestation generates 10 scenes
- Each scene creates 4 images (40 images total)
- This uses significant API quota
- Generation typically takes 2-5 minutes depending on API response times
- All generation happens in parallel to maximize speed

## Support

For issues, questions, or feature requests, please check:
- The browser console for detailed error messages
- API service status pages (Google AI, ElevenLabs)
- Your API quota and billing status

Enjoy manifesting your visions!
