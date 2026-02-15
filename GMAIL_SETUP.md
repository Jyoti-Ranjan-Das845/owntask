# Gmail SMTP Setup Guide

## What This Does
Automatically sends beautiful promise emails to both of you when "Make a Promise" button is clicked!

**Recipients:**
- You: jyoti.r.das845@gmail.com
- Her: swainmousumi86@gmail.com

## Step 1: Enable Gmail App Password

Google requires an "App Password" for security (not your regular Gmail password).

### Enable 2-Step Verification First:
1. Go to: https://myaccount.google.com/security
2. Click "2-Step Verification"
3. Follow steps to enable it (you'll need your phone)

### Create App Password:
1. Go to: https://myaccount.google.com/apppasswords
2. Select app: **Mail**
3. Select device: **Other (Custom name)**
4. Enter name: **Valentine Timeline**
5. Click **Generate**
6. Copy the 16-character password (looks like: `abcd efgh ijkl mnop`)

## Step 2: Create .env File

```bash
cd /Users/jyotiranjandas/owntask/codex

# Create .env file
cat > .env << 'EOF'
GMAIL_USER=jyoti.r.das845@gmail.com
GMAIL_APP_PASSWORD=your_16_character_app_password_here
EOF
```

Replace `your_16_character_app_password_here` with the password you generated (remove spaces).

## Step 3: Install Dependencies

```bash
npm install
```

This installs:
- `nodemailer` - Email sending
- `express` - API server
- `cors` - Allow frontend to call API

## Step 4: Start Email Server

```bash
npm start
```

You should see:
```
✉️  Email server running on port 3000
📧 Ready to send promise emails!
```

## Step 5: Test!

1. Open `timeline.html` in browser
2. Navigate through all cards to promise card
3. Click "Make a Promise"
4. Check both email inboxes! 📧💕

## Email Preview

Both of you will receive a beautiful HTML email with:
- Subject: "💕 Promise Made Forever"
- Beautiful centered design with hearts
- The full promise message
- Date sent
- Wine red color theme matching the timeline

## Troubleshooting

### "Invalid login"
- Make sure you created an App Password (not regular password)
- Check 2-Step Verification is enabled
- Verify GMAIL_APP_PASSWORD in .env has no spaces

### "Username and Password not accepted"
- App Password might be wrong
- Try generating a new App Password
- Make sure .env file is in the correct directory

### Email not received
- Check spam/junk folders
- Verify email addresses are correct in email-server.js
- Check server logs for errors

### Port 3000 already in use
Edit email-server.js line 79:
```javascript
const PORT = process.env.PORT || 3001;
```

Also update timeline-script.js line 510:
```javascript
const response = await fetch('http://localhost:3001/api/send-promise', {
```

## Keep Server Running

### Option A: Terminal (Simple)
Just keep the terminal open with `npm start` running.

### Option B: PM2 (Background)
```bash
npm install -g pm2
pm2 start email-server.js --name "email-promise"
pm2 save
pm2 startup  # Auto-start on boot
```

## Security Notes

1. **Never share your App Password**
2. **Never commit .env file to Git** (already in .gitignore)
3. **App Password only works with this app** - safe to use
4. **You can revoke it anytime** at https://myaccount.google.com/apppasswords

## Gmail Sending Limits

- Gmail allows: **500 emails per day**
- Your use case: **2 emails per button click**
- You can click the button **250 times per day** (way more than needed!)

## Alternative: Deploy to Cloud

For 24/7 availability without keeping your computer on:

### Vercel:
```bash
npm install -g vercel
vercel
```

Add environment variables in Vercel dashboard:
- `GMAIL_USER`
- `GMAIL_APP_PASSWORD`

### Railway:
```bash
npm install -g @railway/cli
railway login
railway up
```

Add same environment variables in Railway dashboard.

## Cost

**100% FREE!**
- Gmail SMTP: Free (500/day limit)
- Vercel hosting: Free
- Railway hosting: Free tier available
- Perfect for personal use!
