# VultraDrop Installation Guide

## Prerequisites

Before awakening the digital lifeform, ensure you have:

- **Node.js** (v18 or higher)
- **npm** (comes with Node.js)
- **Git** (for cloning the repository)

## Step-by-Step Installation

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/vultradrop.git
cd vultradrop
```

### 2. Obtain Your API Keys

VultraDrop requires two API keys to manifest visions:

#### Google Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/)
2. Sign in with your Google account
3. Click "Get API Key" or "Create API Key"
4. Copy your API key

#### ElevenLabs API Key

1. Visit [ElevenLabs](https://elevenlabs.io/)
2. Sign up or log in to your account
3. Navigate to your profile settings
4. Find the "API Keys" section
5. Copy your API key

### 3. Configure Environment Variables

Open the `.env` file in the project root and replace the placeholder values:

```env
# Your Google Gemini API Key
GEMINI_API_KEY=your_actual_gemini_api_key_here

# Your ElevenLabs API Key
ELEVENLABS_API_KEY=your_actual_elevenlabs_api_key_here
```

**IMPORTANT:** Never commit your `.env` file to version control. It's already included in `.gitignore`.

### 4. Start the Application

Run the following command:

```bash
npm start
```

This will:
- Install all necessary dependencies
- Start the development server
- Open VultraDrop in your default browser at `http://localhost:3000`

## Alternative Start Methods

If you prefer to install dependencies separately:

```bash
# Install dependencies first
npm install

# Then start the development server
npm run dev
```

## Verification

Once the application starts, you should see:

1. The Genesis animation sequence
2. The "VULTRA DROP" particle formation
3. An "AWAKEN" button to enter the main interface

## Troubleshooting

### "API Key not found" errors

- Ensure your `.env` file has both `GEMINI_API_KEY` and `ELEVENLABS_API_KEY`
- Check that there are no extra spaces or quotes around the keys
- Verify the keys are valid by testing them in the respective API consoles

### Build errors

```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Port already in use

If port 3000 is already in use, you can change it in `vite.config.ts`:

```typescript
server: {
  port: 3001,  // Change to any available port
  host: '0.0.0.0',
}
```

## Production Build

To create a production build:

```bash
npm run build
```

The optimized build will be in the `dist/` directory.

To preview the production build:

```bash
npm run preview
```

## What to Expect

After successful installation, you can:

1. Experience the Genesis sequence
2. Navigate through 4 AI visualization layers (Raindrop, Vultr, ElevenLabs, Gemini/Cerebras)
3. Open the Creative Hyperverse to manifest cinematic trailers
4. View the Showcase Gallery of example renders
5. Switch between 4 visual themes

## Next Steps

Once running, try creating your first vision in the Creative Hyperverse:

1. Click the film icon or press 'H'
2. Enter a creative vision (e.g., "An epic space odyssey about discovering ancient alien ruins")
3. Select your preferred aspect ratio
4. Click "MANIFEST"
5. Wait 30-60 seconds for the AI to generate your concept trailer
6. Click "Play Trailer" to experience your creation

Welcome to the future of creative manifestation!
