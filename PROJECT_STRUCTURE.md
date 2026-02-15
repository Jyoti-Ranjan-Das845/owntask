# Project File Structure 📁

## Core Files

### HTML Files
- **timeline.html** - Main timeline page with 8 interactive cards and hopping heart animation
- **valentine.html** - Celebration page with curtains, falling cards, balloons, and candles

### CSS Files
- **timeline-style.css** - All timeline page styles and animations (17KB)
- **valentine.css** - All valentine page styles and animations (21KB)

### JavaScript Files
- **timeline-script.js** - Timeline interactions and email sending (16KB)
- **valentine.js** - Valentine page interactions (balloons, candles) (3.4KB)
- **email-server.js** - Express server for email sending via Gmail SMTP (4.1KB)

### Configuration Files
- **package.json** - Node.js dependencies and scripts
- **package-lock.json** - Locked dependency versions
- **.env** - Environment variables (Gmail credentials) - **NOT IN GIT**
- **.env.example** - Template for environment variables
- **.gitignore** - Git ignore rules (excludes node_modules, .env, etc.)

### Documentation
- **README.md** - Main project documentation with setup instructions
- **DEPLOYMENT.md** - Deployment checklist and hosting options
- **GMAIL_SETUP.md** - Gmail App Password setup guide
- **PROJECT_STRUCTURE.md** - This file

### Dependencies (node_modules/)
- express - Web server
- nodemailer - Email sending
- cors - Cross-origin resource sharing
- dotenv - Environment variables

### Images
- **images/timeline-images/** - Contains 7 timeline milestone photos (1.png to 7.png)

## File Sizes

| File | Size | Description |
|------|------|-------------|
| timeline-style.css | 17KB | Timeline styles |
| valentine.css | 21KB | Valentine page styles |
| timeline-script.js | 16KB | Timeline logic |
| timeline.html | 13KB | Timeline HTML |
| valentine.html | 4.6KB | Valentine HTML |
| email-server.js | 4.1KB | Email API |
| valentine.js | 3.4KB | Valentine interactions |

## Total Project Size
- Core files: ~79KB
- With node_modules: ~5MB
- With images: Varies based on image sizes

## Entry Points

### For Users:
1. **timeline.html** - Start here (open in browser)
2. Click through 8 cards
3. Make a promise → Sends emails
4. Click "My Valentine" → Opens valentine.html

### For Developers:
1. `npm install` - Install dependencies
2. `npm start` - Start email server on port 3000
3. Open `timeline.html` in browser

## API Endpoints

### Email Server (http://localhost:3000)
- `POST /api/send-promise` - Send promise emails
- `GET /api/health` - Health check

## Environment Variables Required

```env
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-16-char-app-password
```

## Git Repository Structure

```
codex/
├── .gitignore               # Git ignore rules
├── .env.example             # Environment template
├── README.md                # Main documentation
├── DEPLOYMENT.md            # Deployment guide
├── GMAIL_SETUP.md          # Gmail setup
├── PROJECT_STRUCTURE.md    # This file
├── package.json            # Dependencies
├── package-lock.json       # Locked versions
├── email-server.js         # Email API
├── timeline.html           # Timeline page
├── timeline-style.css      # Timeline styles
├── timeline-script.js      # Timeline logic
├── valentine.html          # Valentine page
├── valentine.css           # Valentine styles
├── valentine.js            # Valentine logic
└── images/
    └── timeline-images/
        ├── 1.png           # Milestone 1
        ├── 2.png           # Milestone 2
        ├── 3.png           # Milestone 3
        ├── 4.png           # Milestone 4
        ├── 5.png           # Milestone 5
        ├── 6.png           # Milestone 6
        └── 7.png           # Milestone 7
```

## Files NOT in Git
- `.env` - Contains sensitive Gmail credentials
- `node_modules/` - Dependencies (installed via npm)
- `.DS_Store` - macOS system file
- `*.log` - Log files

## Quick Commands

```bash
# Install dependencies
npm install

# Start email server
npm start

# Open timeline page
open timeline.html

# Check email server health
curl http://localhost:3000/api/health

# Test send promise email
curl -X POST http://localhost:3000/api/send-promise
```

## Browser Files Loaded

### timeline.html loads:
1. timeline-style.css
2. timeline-script.js
3. images/timeline-images/1.png through 7.png
4. Google Fonts (Dancing Script)

### valentine.html loads:
1. valentine.css
2. valentine.js
3. Google Fonts (Dancing Script)

## Network Requests

### Timeline Page:
- API call to `/api/send-promise` when "Make a Promise" is clicked
- Links to valentine.html when "My Valentine" is clicked

### Valentine Page:
- No external API calls
- All animations are CSS-based
- No dependencies on backend

## Production Considerations

1. **Minification** - CSS/JS files can be minified for production
2. **Image Optimization** - Convert images to WebP for better compression
3. **CDN** - Serve static assets via CDN for better performance
4. **Environment Variables** - Set on hosting platform
5. **HTTPS** - Required for production deployment
6. **CORS** - Already configured in email-server.js

## Development vs Production

### Development:
- Email server runs on `localhost:3000`
- Open timeline.html directly in browser
- .env file contains Gmail credentials

### Production:
- Email server runs on hosting platform (Vercel, Heroku, etc.)
- timeline.html served via web server
- Environment variables set on hosting platform
- HTTPS enabled automatically

---

**Last Updated:** February 14, 2026
