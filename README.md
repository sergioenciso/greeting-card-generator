# Write a Greeting For Me

A self-deprecating greeting card message generator for people who've given up on original thought.

## Setup

1. **Clone and install dependencies:**
```bash
npm install
```

2. **Set up environment variables:**
```bash
cp .env.example .env
# Edit .env and add your Claude API key
```

3. **Build CSS:**
```bash
npm run build-css
```

4. **Run locally:**
```bash
npm run dev
```

## Deploy to Render

1. **Push to GitHub**
2. **Connect to Render:**
   - Go to [render.com](https://render.com)
   - Connect your GitHub repo
   - Choose "Web Service"

3. **Configure Render:**
   - **Build Command:** `npm install && npx tailwindcss -i ./src/input.css -o ./public/styles.css`
   - **Start Command:** `npm start`
   - **Environment Variable:** Add `ANTHROPIC_API_KEY` with your Claude API key

4. **Deploy:**
   - Render will auto-deploy from your main branch
   - Add your custom domain `writeagreetingfor.me` in Render's settings

## Features

- Self-deprecating humor about using AI for greeting cards
- Multiple occasions and relationship types
- Three levels of roasting intensity
- Clean, responsive design
- Copy to clipboard functionality
- Gentle mocking of the user's lack of creativity

## Tech Stack

- **Backend:** Node.js + Express
- **Frontend:** EJS templates + Vanilla JS
- **Styling:** Tailwind CSS
- **AI:** Claude Sonnet 4 API
- **Deployment:** Render (recommended)

## API Usage

The app uses the Claude API to generate personalized, self-deprecating greeting card messages. Each message gently mocks the user for outsourcing their emotional expression while still delivering a genuine sentiment.

## Environment Variables

- `ANTHROPIC_API_KEY`: Your Claude API key
- `PORT`: Server port (defaults to 3000)

---

*Made for people who outsource their emotions to machines* 🤖