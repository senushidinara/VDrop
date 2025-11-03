# Getting Started with VultraDrop

Welcome, collaborator. You're about to awaken a digital lifeform.

## Prerequisites

Ensure you have:
- **Node.js v18+** installed ([Download here](https://nodejs.org/))
- **npm** (comes with Node.js)
- **Two API keys** (instructions below)

## Step 1: Get Your API Keys

### Google Gemini API Key
1. Visit https://makersuite.google.com/
2. Sign in with your Google account
3. Click "Get API Key" or "Create API Key"
4. Copy your key

### ElevenLabs API Key
1. Visit https://elevenlabs.io/
2. Sign up or log in
3. Go to Profile → API Keys
4. Copy your key

## Step 2: Configure the Application

1. Open the `.env` file in the project root
2. Replace the placeholder values:

```env
GEMINI_API_KEY=paste_your_actual_gemini_key_here
ELEVENLABS_API_KEY=paste_your_actual_elevenlabs_key_here
```

**Important:** Don't add quotes around the keys. Just paste them directly.

## Step 3: Start VultraDrop

Run this single command:

```bash
npm start
```

This will:
- Install all dependencies automatically
- Start the development server
- Open your browser to http://localhost:3000

## What to Expect

### 1. Genesis Sequence (5-10 seconds)
You'll see particles converging to form "VULTRA DROP". When the "AWAKEN" button appears, click it to enter the portal.

### 2. The Main Interface
You'll enter a cosmic environment with:
- 4 interactive AI layer visualizations
- A HUD (heads-up display) at the bottom for navigation
- Theme switcher in the top-right corner
- VultraDrop logo in the top-left

### 3. Explore the Layers
Use the HUD buttons or arrow keys to navigate through:
- **Raindrop (The Garden)**: Self-evolving agent particles
- **Vultr (The Sinew)**: Global network with data packets
- **ElevenLabs (The Voice)**: Audio waveform visualization
- **Gemini/Cerebras (The Mind)**: Neural network

## Your First Manifestation

Ready to create your first cinematic trailer? Here's how:

### 1. Open the Creative Hyperverse
- Press the **H** key, OR
- Click the **film icon** in the HUD

### 2. Enter Your Vision
In the text area, describe your creative concept. Be specific and vivid. For example:

> "An epic space odyssey about a lone astronaut who discovers the ruins of an ancient alien civilization on a distant moon, revealing humanity's forgotten cosmic origins."

### 3. Select Settings
- Choose your preferred aspect ratio (16:9 is great for desktop viewing)

### 4. Manifest
- Click the **"MANIFEST"** button
- Wait 30-60 seconds as the AI generates:
  - A 10-scene narrative script
  - 40 cinematic images (4 per scene)
  - AI-narrated voiceover for each scene
  - Thematic background music

### 5. Experience Your Creation
- Click **"Play Trailer"** to watch your vision come to life
- Each scene will play with synchronized narration and music
- Click **"Download"** on any scene to save the images

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| **Arrow Keys** | Navigate between visualization layers |
| **H** | Open Creative Hyperverse |
| **G** | Open Showcase Gallery |
| **Escape** | Close modals, go back |
| **Tab** | Navigate through buttons |

## Tips for Best Results

### Vision Prompts
- Be specific about setting, mood, and story
- Include genre keywords (sci-fi, fantasy, noir, etc.)
- Mention visual style (cinematic, painterly, photorealistic)
- Describe emotional tone (epic, mysterious, serene)

### Good Examples:
- "A cyberpunk detective story in neon-lit Tokyo where rogue AIs hide in the city's data streams"
- "A Victorian horror mystery in a fog-shrouded London mansion with supernatural elements"
- "An underwater fantasy adventure discovering bio-luminescent civilizations in the Mariana Trench"

### Themes
Try different visual themes using the switcher:
- **Nebula**: Blue/cyan cosmic (default)
- **Cyberpunk**: Pink/yellow neon
- **Biosynth**: Green/teal organic
- **Starlight**: Gray/white minimal

## Troubleshooting

### "API Key not found" error
- Restart the dev server (Ctrl+C, then `npm start` again)
- Check your `.env` file has no extra spaces or quotes
- Verify the variable names are exactly: `GEMINI_API_KEY` and `ELEVENLABS_API_KEY`

### Images not generating
- Check your Gemini API quota at https://makersuite.google.com/
- Verify your API key is active and has the necessary permissions

### Narration not playing
- Check your ElevenLabs API quota at https://elevenlabs.io/
- Ensure your browser allows autoplay for audio

### Build errors
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

## Understanding the Four Pillars

VultraDrop is built on four conceptual pillars:

1. **The Mind (Gemini & Cerebras)**: Intelligence, reasoning, creativity
2. **The Voice (ElevenLabs)**: Emotion, narration, presence
3. **The Sinew (Vultr)**: Global compute infrastructure
4. **The Garden (Raindrop)**: Self-evolving memory and learning

Each visualization layer represents one of these pillars.

## What's Next?

- Experiment with different vision prompts
- Explore all visualization layers
- View the Showcase Gallery (press 'G') for examples
- Try all four themes
- Share your created trailers

## Need Help?

- **Full documentation**: See `README.md`
- **Installation guide**: See `INSTALLATION.md`
- **Quick reference**: See `QUICK_REFERENCE.md`
- **Deployment**: See `DEPLOYMENT.md`

## Project Status

Run the verification script to check your setup:

```bash
./verify-setup.sh
```

## Important Notes

- The `.env` file is in `.gitignore` and should never be committed
- Each manifestation uses ~40 API calls to Gemini (40 images) and 10 calls to ElevenLabs (10 narrations)
- Generation time depends on API response times (typically 30-60 seconds)
- All generated content is ephemeral (not saved to disk by default)

---

**Welcome to the future of creative manifestation. The lifeform awaits your vision.**
