# Valentine's Day Timeline & Celebration 💕

A beautiful, interactive Valentine's Day experience featuring an animated timeline journey and celebration page with falling letter cards, interactive balloons, and candles.

## Features

### Timeline Page (`timeline.html`)
- **8 Interactive Cards** - Journey through relationship milestones with photos and stories
- **Hopping Heart Animation** - Smooth SVG path animation with progressive reveals
- **Mini Card Markers** - Quick navigation to visited moments
- **Promise Card** - Make a promise and send beautiful emails to both recipients
- **My Valentine Button** - Access the celebration page after viewing all cards

### Valentine Celebration Page (`valentine.html`)
- **Curtain Opening Effect** - Dramatic wavy curtain reveal (2.5s)
- **Falling Letter Cards** - VALENTINE cards fall slowly after curtain opens with holes and red wine strings
- **Interactive Balloons** - Click to blast, regenerates with fade-in after 1 second
- **Blow Candles** - Click to blow out 3 candles, reveals special message when all are blown
- **Confetti & Floating Hearts** - Ambient animations throughout
- **String Lights** - U-shaped decorative lights inside the celebration board

## Tech Stack

- **Frontend**: HTML5, CSS3 (with advanced animations), Vanilla JavaScript
- **Backend**: Node.js, Express
- **Email**: Nodemailer with Gmail SMTP
- **Styling**: Custom CSS with gradients, transforms, and keyframe animations

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

This will install:
- `express` - Web server
- `nodemailer` - Email sending
- `cors` - Cross-origin resource sharing
- `dotenv` - Environment variable management

### 2. Configure Gmail App Password

The email feature uses Gmail SMTP. You need to set up a Gmail App Password:

1. Go to your Google Account settings
2. Enable 2-Factor Authentication
3. Go to Security > 2-Step Verification > App Passwords
4. Generate a new app password for "Mail"
5. Copy the 16-character password

### 3. Update Environment Variables

Create a `.env` file in the root directory:

```env
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-16-char-app-password
```

**For deployment**: Update these values with your own Gmail credentials.

### 4. Update Email Recipients (Optional)

If you want to change the email recipients, edit `email-server.js` (line 30-33):

```javascript
const recipients = [
  'jyoti.r.das845@gmail.com',
  'swainmousumi86@gmail.com'
];
```

### 5. Add Timeline Images

Place your timeline images in `images/timeline-images/` folder:
- `1.jpg` - First milestone
- `2.jpg` - Second milestone
- `3.jpg` - Third milestone
- `4.jpg` - Fourth milestone
- `5.jpg` - Fifth milestone
- `6.jpg` - Sixth milestone

The timeline.html file references these images.

## Running Locally

### Start the Email Server

```bash
npm start
```

This starts the Express server on `http://localhost:3000`

### Open the Timeline Page

Open `timeline.html` in your browser:

```bash
open timeline.html
```

Or simply double-click the `timeline.html` file.

## Project Structure

```
codex/
├── timeline.html          # Main timeline page
├── timeline-style.css     # Timeline styles
├── timeline-script.js     # Timeline interactions
├── valentine.html         # Celebration page
├── valentine.css          # Celebration styles
├── valentine.js           # Celebration interactions
├── email-server.js        # Email sending server
├── package.json           # Dependencies
├── .env                   # Environment variables (Git ignored)
├── .gitignore            # Git ignore rules
├── GMAIL_SETUP.md        # Gmail setup instructions
└── images/
    └── timeline-images/   # Timeline milestone photos
```

## API Endpoints

### POST `/api/send-promise`
Sends the promise email to both configured recipients.

**Response:**
```json
{
  "success": true,
  "message": "Promise emails sent successfully!",
  "recipients": ["email1@gmail.com", "email2@gmail.com"]
}
```

### GET `/api/health`
Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "message": "Email server is running"
}
```

## Deployment

### Deploy to a Hosting Service

This project can be deployed to:
- **Vercel** - For static hosting + serverless functions
- **Netlify** - For static hosting + serverless functions
- **Heroku** - For Node.js hosting
- **Railway** - For Node.js hosting

### Environment Variables for Production

Make sure to set these environment variables in your hosting platform:
- `GMAIL_USER` - Your Gmail address
- `GMAIL_APP_PASSWORD` - Your Gmail app password
- `PORT` - Server port (usually auto-set by hosting platform)

### Important Security Notes

⚠️ **NEVER commit the `.env` file to Git!** The `.gitignore` file is configured to exclude it.

⚠️ **Change the Gmail credentials** before deploying to production if you don't want to use the current ones.

## Customization

### Timeline Content
Edit `timeline.html` to update card content, titles, and descriptions.

### Email Template
Edit `email-server.js` (lines 36-107) to customize the promise email HTML template.

### Colors
The project uses a wine-red color scheme. Update CSS variables in `valentine.css`:

```css
:root {
  --wine-dark: #12010a;
  --wine: #611436;
  --wine-light: #c64169;
  --rose: #ff9dbf;
  --cream: #fff6fb;
}
```

## Browser Compatibility

- Chrome/Edge: ✅ Fully supported
- Firefox: ✅ Fully supported
- Safari: ✅ Fully supported
- Mobile browsers: ✅ Responsive design included

## Animations & Interactions

### Timeline Page
- Heart hopping along SVG curved path (10 hops per segment)
- Progressive dash reveal animation
- Card fade-in and scale effects
- Checkpoint pin appearance
- Mini card markers for navigation

### Valentine Page
- Curtain opening: 2.5s dramatic reveal
- Letter cards: Fall sequentially after curtain opens (0.15s delay between each)
- Balloons: Blast animation with 8 particles, regenerate after 1s
- Candles: Flickering glow, blow-out on click with "💨 Blow" hover popup
- Message reveal: Bold message appears when all 3 candles are blown
- String segments: Red wine colored strings connecting card holes
- Hover effects on cards for realistic touch feel

## Credits

Built with ❤️ for Valentine's Day 2026

## License

This is a personal project. Feel free to use and modify for your own Valentine's Day celebration!
