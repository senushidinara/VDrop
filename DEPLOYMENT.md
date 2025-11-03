# VultraDrop Deployment Guide 🚀

This guide will help you deploy VultraDrop to Netlify.

## Prerequisites

Before deploying, you need to obtain API keys from:

1. **Google Gemini API Key**
   - Visit [Google AI Studio](https://makersuite.google.com/)
   - Create a new API key
   - Copy the key for later use

2. **ElevenLabs API Key**
   - Visit [ElevenLabs](https://elevenlabs.io/)
   - Sign up or log in
   - Navigate to your profile settings
   - Copy your API key

## Local Development Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd vultradrop
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your API keys:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ELEVENLABS_API_KEY=your_elevenlabs_api_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```
   
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deploying to Netlify

### Option 1: Deploy via Netlify UI (Recommended)

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Connect to Netlify**
   - Go to [Netlify](https://www.netlify.com/)
   - Click "Add new site" → "Import an existing project"
   - Connect your GitHub account
   - Select your VultraDrop repository

3. **Configure build settings**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - These should be auto-detected from `netlify.toml`

4. **Add environment variables**
   - In Netlify dashboard, go to Site settings → Environment variables
   - Add the following variables:
     - `GEMINI_API_KEY`: Your Google Gemini API key
     - `ELEVENLABS_API_KEY`: Your ElevenLabs API key

5. **Deploy**
   - Click "Deploy site"
   - Wait for the build to complete
   - Your site will be live at `https://your-site-name.netlify.app`

### Option 2: Deploy via Netlify CLI

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify**
   ```bash
   netlify login
   ```

3. **Initialize your site**
   ```bash
   netlify init
   ```

4. **Set environment variables**
   ```bash
   netlify env:set GEMINI_API_KEY "your_gemini_api_key_here"
   netlify env:set ELEVENLABS_API_KEY "your_elevenlabs_api_key_here"
   ```

5. **Deploy**
   ```bash
   netlify deploy --prod
   ```

## Build Verification

Before deploying, verify that your build works locally:

```bash
npm run build
npm run preview
```

This will build the production version and serve it locally for testing.

## Troubleshooting

### Build Fails

- **Check Node version**: Ensure you're using Node.js 18 or higher
- **Clear cache**: Delete `node_modules` and `package-lock.json`, then run `npm install` again
- **Check environment variables**: Make sure all required API keys are set

### API Keys Not Working

- **Verify keys are correct**: Double-check that you've copied the full API key
- **Check API quotas**: Ensure you haven't exceeded your API usage limits
- **Environment variables**: Make sure environment variables are set in Netlify dashboard

### Images Not Loading

- **Check paths**: Ensure all image paths start with `/assets/`
- **Verify files**: Make sure showcase images are in `public/assets/showcase/`

## Custom Domain

To use a custom domain:

1. Go to Netlify dashboard → Domain settings
2. Click "Add custom domain"
3. Follow the instructions to configure your DNS

## Performance Optimization

The application is already optimized with:
- ✅ Lazy loading for images
- ✅ Code splitting
- ✅ Minified production build
- ✅ Optimized assets

## Security Notes

- ⚠️ **Never commit `.env` file** - It's already in `.gitignore`
- ⚠️ **Keep API keys secret** - Only add them in Netlify dashboard
- ⚠️ **Rotate keys regularly** - Update API keys periodically for security

## Support

For issues or questions:
- Check the main [README.md](./README.md) for project documentation
- Review the [GitHub Issues](https://github.com/your-repo/issues)
- Contact the development team

---

**Happy Deploying! ✨**
