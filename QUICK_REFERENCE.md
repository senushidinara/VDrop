# VultraDrop Quick Reference

## Quick Start Commands

```bash
# Start the application (installs dependencies automatically)
npm start

# Install dependencies only
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Required Environment Variables

```env
GEMINI_API_KEY=your_gemini_api_key_here
ELEVENLABS_API_KEY=your_elevenlabs_api_key_here
```

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| Arrow Keys | Navigate between visualization layers |
| H | Open Creative Hyperverse |
| G | Open Showcase Gallery |
| Escape | Close modals/return to previous view |
| Tab | Navigate through interactive elements |

## Application Structure

1. **Genesis Sequence**: Opening animation showing "VULTRA DROP" particle formation
2. **Visualization Layers**: 4 interactive AI layers
   - Raindrop (The Garden): Self-evolving agents
   - Vultr (The Sinew): Global network visualization
   - ElevenLabs (The Voice): Audio waveform
   - Gemini/Cerebras (The Mind): Neural network
3. **Creative Hyperverse**: AI-powered trailer generation
4. **Showcase Gallery**: Example renders and outputs

## Using Creative Hyperverse

1. Press 'H' or click the film icon
2. Enter your creative vision (be specific and descriptive)
3. Select aspect ratio (16:9 recommended for desktop)
4. Click "MANIFEST"
5. Wait 30-60 seconds for generation
6. Click "Play Trailer" to view your creation

## Example Vision Prompts

- "An epic space opera about a lone astronaut discovering ancient alien ruins"
- "A cyberpunk detective story in neon-lit Tokyo where AI and humans coexist"
- "A fantasy journey through enchanted forests to find the lost crystal of power"
- "An underwater expedition exploring mysterious deep ocean ruins"
- "A Victorian-era murder mystery in a grand mansion"

## Themes

- **Nebula** (default): Blue/cyan cosmic theme
- **Cyberpunk**: Pink/yellow neon theme
- **Biosynth**: Green/teal organic theme
- **Starlight**: Gray/white minimalist theme

## API Key Sources

- **Gemini**: https://makersuite.google.com/
- **ElevenLabs**: https://elevenlabs.io/

## Default Port

The application runs on `http://localhost:3000`

## File Structure

```
vultradrop/
├── components/          # React components
├── hooks/              # Custom React hooks
├── services/           # API service layers
├── contexts/           # React contexts
├── public/             # Static assets
│   └── assets/         # Images and SVGs
├── .env                # Environment variables (DO NOT COMMIT)
├── index.html          # Entry HTML
├── index.tsx           # Entry TypeScript
└── vite.config.ts      # Vite configuration
```

## Troubleshooting

### API Key Errors
- Check `.env` file has correct variable names
- Ensure no extra spaces or quotes
- Verify keys are valid in respective API consoles

### Build Errors
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Port In Use
Edit `vite.config.ts` and change the port number in the server section.

## Support Resources

- README.md: Full project documentation
- INSTALLATION.md: Detailed installation guide
- DEPLOYMENT.md: Netlify deployment guide
- FEATURES.md: Complete feature list

## The Four Pillars

1. **The Mind** - Gemini & Cerebras (reasoning, creativity)
2. **The Voice** - ElevenLabs (narration, emotion)
3. **The Sinew** - Vultr (global infrastructure)
4. **The Garden** - Raindrop (self-evolving memory)
