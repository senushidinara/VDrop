# 🚀 Quick Start - Deploy to Netlify in 5 Minutes

## Step 1: Get Your API Keys (2 minutes)

### Google Gemini API Key
1. Go to https://makersuite.google.com/
2. Click "Get API Key"
3. Copy your key

### ElevenLabs API Key
1. Go to https://elevenlabs.io/
2. Sign up/Login
3. Go to Profile → API Keys
4. Copy your key

## Step 2: Deploy to Netlify (3 minutes)

### Option A: One-Click Deploy (Easiest)

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start)

1. Click the button above
2. Connect your GitHub account
3. Give your site a name
4. Add your API keys when prompted:
   - `GEMINI_API_KEY`
   - `ELEVENLABS_API_KEY`
5. Click "Deploy site"
6. Done! 🎉

### Option B: Manual Deploy

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Connect to Netlify**
   - Go to https://app.netlify.com/
   - Click "Add new site" → "Import an existing project"
   - Select your repository
   - Build settings are auto-detected from `netlify.toml`

3. **Add Environment Variables**
   - Go to Site settings → Environment variables
   - Add:
     - `GEMINI_API_KEY`: [your key]
     - `ELEVENLABS_API_KEY`: [your key]

4. **Deploy**
   - Click "Deploy site"
   - Wait ~1 minute
   - Your site is live! 🚀

## Step 3: Test Your Site

1. Visit your Netlify URL (e.g., `https://your-site.netlify.app`)
2. Click "AWAKEN" to start the Genesis sequence
3. Navigate through the layers using the HUD buttons
4. Press "H" to open the Creative Hyperverse
5. Press "G" to view the Showcase Gallery

## Keyboard Shortcuts

- **Arrow Keys**: Navigate between layers
- **H**: Open Creative Hyperverse
- **G**: Open Showcase Gallery
- **Escape**: Close modals

## Troubleshooting

### Build Failed?
- Check that Node.js version is 18+ in Netlify settings
- Verify all environment variables are set correctly

### API Not Working?
- Double-check your API keys are correct
- Ensure you haven't exceeded API quotas
- Check browser console for error messages

### Images Not Loading?
- Clear browser cache
- Check that showcase images are in `public/assets/showcase/`

## Need Help?

- 📖 Read the full [DEPLOYMENT.md](./DEPLOYMENT.md)
- 📚 Check the [README.md](./README.md)
- 🐛 Report issues on GitHub

---

**Enjoy your VultraDrop experience! ✨**
