#!/bin/bash

echo "======================================"
echo "VultraDrop Setup Verification"
echo "======================================"
echo ""

# Check Node.js
echo "Checking Node.js..."
if command -v node &> /dev/null; then
    echo "✓ Node.js found: $(node --version)"
else
    echo "✗ Node.js not found. Please install Node.js v18 or higher."
    exit 1
fi

# Check npm
echo "Checking npm..."
if command -v npm &> /dev/null; then
    echo "✓ npm found: $(npm --version)"
else
    echo "✗ npm not found. Please install npm."
    exit 1
fi

# Check .env file
echo ""
echo "Checking environment configuration..."
if [ -f .env ]; then
    echo "✓ .env file exists"
    
    if grep -q "GEMINI_API_KEY=YOUR_GEMINI_API_KEY_HERE" .env; then
        echo "⚠ WARNING: GEMINI_API_KEY not configured"
        echo "  Please add your actual Gemini API key to .env"
    else
        echo "✓ GEMINI_API_KEY configured"
    fi
    
    if grep -q "ELEVENLABS_API_KEY=YOUR_ELEVENLABS_API_KEY_HERE" .env; then
        echo "⚠ WARNING: ELEVENLABS_API_KEY not configured"
        echo "  Please add your actual ElevenLabs API key to .env"
    else
        echo "✓ ELEVENLABS_API_KEY configured"
    fi
else
    echo "✗ .env file not found"
    exit 1
fi

# Check critical directories
echo ""
echo "Checking project structure..."
[ -d "public/assets/showcase" ] && echo "✓ Showcase directory exists" || echo "✗ Showcase directory missing"
[ -d "components" ] && echo "✓ Components directory exists" || echo "✗ Components directory missing"
[ -d "services" ] && echo "✓ Services directory exists" || echo "✗ Services directory missing"
[ -d "hooks" ] && echo "✓ Hooks directory exists" || echo "✗ Hooks directory missing"

# Check critical files
echo ""
echo "Checking critical files..."
[ -f "index.html" ] && echo "✓ index.html exists" || echo "✗ index.html missing"
[ -f "package.json" ] && echo "✓ package.json exists" || echo "✗ package.json missing"
[ -f "vite.config.ts" ] && echo "✓ vite.config.ts exists" || echo "✗ vite.config.ts missing"
[ -f "tsconfig.json" ] && echo "✓ tsconfig.json exists" || echo "✗ tsconfig.json missing"

# Check showcase images
echo ""
echo "Checking showcase images..."
IMAGE_COUNT=$(ls -1 public/assets/showcase/IMG_*.jpeg 2>/dev/null | wc -l)
if [ "$IMAGE_COUNT" -ge 9 ]; then
    echo "✓ Found $IMAGE_COUNT showcase images"
else
    echo "⚠ WARNING: Found only $IMAGE_COUNT showcase images (expected 9+)"
fi

# Check if node_modules exists
echo ""
echo "Checking dependencies..."
if [ -d "node_modules" ]; then
    echo "✓ Dependencies installed"
else
    echo "⚠ Dependencies not installed. Run 'npm install' or 'npm start'"
fi

echo ""
echo "======================================"
echo "Verification complete!"
echo "======================================"
echo ""
echo "To start VultraDrop, run:"
echo "  npm start"
echo ""
