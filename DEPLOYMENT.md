# Deployment Checklist 🚀

Follow this checklist to deploy your Valentine's Day project successfully.

## Pre-Deployment Checklist

### 1. Environment Variables ✅
- [ ] Create `.env` file with your Gmail credentials
- [ ] Test email sending locally using `npm start`
- [ ] Verify emails are being received by both recipients

### 2. File Verification ✅
- [ ] All timeline images are in `images/timeline-images/` (1.png to 7.png)
- [ ] `timeline.html` opens correctly in browser
- [ ] `valentine.html` opens correctly in browser
- [ ] All animations are working smoothly

### 3. Content Review ✅
- [ ] Update timeline card content with your own stories
- [ ] Update email recipients in `email-server.js` if needed
- [ ] Customize the promise message in `email-server.js`
- [ ] Change "Happy Valentine's Day Sonussi 💕" message in `valentine.html` if needed

### 4. Email Configuration ✅
- [ ] Gmail App Password is generated (see GMAIL_SETUP.md)
- [ ] Test sending promise email locally
- [ ] Confirm both recipients receive the email

## Deployment Options

### Option 1: Vercel (Recommended for Full-Stack)

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```

4. **Set Environment Variables**
   - Go to your Vercel project settings
   - Add `GMAIL_USER` and `GMAIL_APP_PASSWORD`

5. **Redeploy**
   ```bash
   vercel --prod
   ```

### Option 2: Netlify (Static + Functions)

1. **Create `netlify.toml`**
   ```toml
   [build]
     functions = "functions"

   [[redirects]]
     from = "/api/*"
     to = "/.netlify/functions/:splat"
     status = 200
   ```

2. **Move email server to functions**
   - Create `functions/` folder
   - Move email logic to serverless function

3. **Deploy via Netlify CLI or Drag & Drop**
   ```bash
   npm install -g netlify-cli
   netlify deploy --prod
   ```

4. **Set Environment Variables**
   - Go to Site Settings > Environment Variables
   - Add `GMAIL_USER` and `GMAIL_APP_PASSWORD`

### Option 3: Heroku (Traditional Node.js)

1. **Create Heroku Account** at https://heroku.com

2. **Install Heroku CLI**
   ```bash
   brew install heroku/brew/heroku  # macOS
   ```

3. **Login**
   ```bash
   heroku login
   ```

4. **Create App**
   ```bash
   heroku create your-valentine-app
   ```

5. **Set Environment Variables**
   ```bash
   heroku config:set GMAIL_USER=your-email@gmail.com
   heroku config:set GMAIL_APP_PASSWORD=your-app-password
   ```

6. **Deploy**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git push heroku main
   ```

7. **Create `Procfile`**
   ```
   web: node email-server.js
   ```

### Option 4: Railway (Easiest Node.js)

1. **Go to** https://railway.app

2. **Click "Start a New Project"**

3. **Deploy from GitHub**
   - Connect your GitHub repository
   - Railway auto-detects Node.js

4. **Set Environment Variables**
   - Go to Variables tab
   - Add `GMAIL_USER` and `GMAIL_APP_PASSWORD`

5. **Deploy** - Railway automatically builds and deploys

## Post-Deployment

### 1. Test Everything ✅
- [ ] Visit your deployed timeline page
- [ ] Click through all 8 cards
- [ ] Test the hopping heart animation
- [ ] Click "Make a Promise" button
- [ ] Verify emails are sent successfully
- [ ] Click "My Valentine" button
- [ ] Test valentine.html features:
  - [ ] Curtains open smoothly
  - [ ] Letter cards fall after curtain
  - [ ] Balloons blast and regenerate
  - [ ] Candle hover shows "💨 Blow" popup
  - [ ] Candles blow out when clicked
  - [ ] Message reveals after all 3 candles blown

### 2. Share with Your Valentine ❤️
- [ ] Get the deployed URL
- [ ] Test on mobile device
- [ ] Share the link!

## Troubleshooting

### Emails Not Sending
1. Check Gmail App Password is correct
2. Verify 2FA is enabled on Gmail account
3. Check server logs for errors
4. Test with `curl`:
   ```bash
   curl -X POST http://your-domain.com/api/send-promise
   ```

### Animations Not Working
1. Clear browser cache
2. Check browser console for errors
3. Verify all CSS and JS files are loaded
4. Test in different browser

### Images Not Loading
1. Verify image paths are correct
2. Check images exist in `images/timeline-images/`
3. Ensure images are committed to Git
4. Check hosting platform includes image files

## Security Reminders

⚠️ **Important Security Notes:**

1. **Never commit `.env` file** - It's already in `.gitignore`
2. **Keep Gmail App Password secret** - Don't share it
3. **Use environment variables** for all sensitive data
4. **Rotate passwords** if exposed

## Performance Optimization

### For Production:
1. **Minify CSS/JS** (optional)
   ```bash
   npm install -g clean-css-cli uglify-js
   cleancss -o valentine.min.css valentine.css
   uglifyjs valentine.js -o valentine.min.js
   ```

2. **Optimize Images**
   - Use WebP format for better compression
   - Resize images to appropriate dimensions

3. **Enable Caching**
   - Configure hosting platform for static asset caching

## Monitoring

### Check if Email Server is Running:
```bash
curl http://your-domain.com/api/health
```

Expected response:
```json
{
  "status": "ok",
  "message": "Email server is running"
}
```

## Support

If you encounter issues:
1. Check the logs in your hosting platform
2. Review `GMAIL_SETUP.md` for email configuration
3. Test locally first with `npm start`
4. Ensure all environment variables are set

---

**Good luck with your deployment! 💕**
