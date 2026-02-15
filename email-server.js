// Email server using Brevo HTTP API (300 emails/day free!)
require('dotenv').config();
const SibApiV3Sdk = require('@sendinblue/client');
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files (HTML, CSS, JS, images)
app.use(express.static(__dirname));

// Brevo HTTP API configuration - uses port 443 (HTTPS), never blocked!
const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
apiInstance.setApiKey(SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY);

// Verify API key on startup
console.log('Brevo HTTP API config:', {
  hasApiKey: !!process.env.BREVO_API_KEY,
  apiKeyPrefix: process.env.BREVO_API_KEY ? process.env.BREVO_API_KEY.substring(0, 15) + '...' : 'none'
});
console.log('✅ Brevo HTTP API initialized (port 443 - never blocked!)');
console.log('📧 Ready to send emails (300/day free)');

// Helper function to send email with retry logic
async function sendEmailWithRetry(emailData, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const result = await apiInstance.sendTransacEmail(emailData);
      return result;
    } catch (error) {
      console.log(`Attempt ${attempt}/${maxRetries} failed:`, error.message);
      console.log('Full error:', JSON.stringify(error, null, 2));
      if (error.response) {
        console.log('API Response:', error.response.body || error.response.text);
      }

      if (attempt === maxRetries) {
        throw error;
      }

      // Exponential backoff: wait 2^attempt seconds
      const delay = Math.pow(2, attempt) * 1000;
      console.log(`Retrying in ${delay/1000} seconds...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

// API endpoint to send promise emails
app.post('/api/send-promise', async (req, res) => {
  try {
    // PRODUCTION MODE - sending to both emails
    const recipients = [
      'jyoti.r.das845@gmail.com',
      'swainmousumi86@gmail.com'
    ];

    // Beautiful HTML email template
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: 'Georgia', serif;
            background: linear-gradient(135deg, #1b020c 0%, #4a0a23 100%);
            padding: 40px;
            margin: 0;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border-radius: 20px;
            padding: 40px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
          }
          h1 {
            color: #8d1034;
            font-size: 32px;
            margin-bottom: 20px;
            text-align: center;
          }
          .promise-text {
            font-size: 18px;
            line-height: 1.8;
            color: #333;
            text-align: center;
            margin: 30px 0;
          }
          .heart {
            text-align: center;
            font-size: 48px;
            margin: 20px 0;
          }
          .footer {
            text-align: center;
            color: #666;
            font-size: 14px;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #eee;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Our Promise</h1>
          <div class="heart">💕</div>
          <div class="promise-text">
            <strong>Promise made forever</strong>
            <br><br>
            We promise to never leave each other, no matter what storms come or how hard life gets.
            We'll keep loving like this—fiercely, gently, completely.
            <br><br>
            This isn't just a moment—this is our forever.
          </div>
          <div class="heart">❤️</div>
          <div class="footer">
            Sent with love on ${new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>
        </div>
      </body>
      </html>
    `;

    // Log environment variables for debugging
    console.log('📋 Environment Check:');
    console.log('  BREVO_API_KEY exists:', !!process.env.BREVO_API_KEY);
    console.log('  SENDER_EMAIL:', process.env.SENDER_EMAIL);
    console.log('  SENDER_NAME:', process.env.SENDER_NAME);
    console.log('  Recipients:', recipients);

    // Send emails using Brevo HTTP API - handle each separately to catch partial failures
    const results = await Promise.allSettled(
      recipients.map((to, index) => {
        console.log(`\n🔄 Preparing email ${index + 1} for ${to}`);
        const sendEmail = new SibApiV3Sdk.SendSmtpEmail();
        sendEmail.sender = {
          name: process.env.SENDER_NAME || 'Our Journey',
          email: process.env.SENDER_EMAIL
        };
        sendEmail.to = [{ email: to }];
        sendEmail.subject = '💕 Promise Made Forever';
        sendEmail.htmlContent = htmlContent;
        sendEmail.textContent = 'Promise made forever 💕 - We promise to never leave each other, no matter what storms come or how hard life gets.';

        console.log(`  Sender: ${sendEmail.sender.name} <${sendEmail.sender.email}>`);
        console.log(`  To: ${to}`);
        console.log(`  Subject: ${sendEmail.subject}`);
        console.log(`  Calling Brevo API...`);

        return sendEmailWithRetry(sendEmail);
      })
    );

    // Check results for each recipient
    const successfulEmails = [];
    const failedEmails = [];

    results.forEach((result, index) => {
      const recipient = recipients[index];
      console.log(`\n📨 Result for ${recipient}:`);
      console.log(`  Status: ${result.status}`);

      if (result.status === 'fulfilled' && result.value && result.value.body && result.value.body.messageId) {
        successfulEmails.push({
          email: recipient,
          id: result.value.body.messageId
        });
        console.log(`  ✅ SUCCESS - Message ID: ${result.value.body.messageId}`);
      } else {
        const error = result.status === 'rejected' ? result.reason : result.value;
        console.log(`  ❌ FAILED`);
        console.log(`  Error type: ${typeof error}`);
        console.log(`  Error message: ${error?.message || 'Unknown error'}`);
        console.log(`  Full error object:`, error);

        if (error && typeof error === 'object') {
          console.log(`  Error keys:`, Object.keys(error));
          if (error.response) {
            console.log(`  Response status:`, error.response.status || error.response.statusCode);
            console.log(`  Response body:`, error.response.body);
          }
        }

        failedEmails.push({
          email: recipient,
          error: error?.message || JSON.stringify(error) || 'Unknown error'
        });
      }
    });

    console.log(`\n📊 Summary: ${successfulEmails.length} sent, ${failedEmails.length} failed\n`);

    res.json({
      success: successfulEmails.length > 0,
      message: `${successfulEmails.length} email(s) sent successfully${failedEmails.length > 0 ? `, ${failedEmails.length} failed` : ''}`,
      successful: successfulEmails,
      failed: failedEmails
    });

  } catch (error) {
    console.error('❌ Error sending emails:', error);

    // Provide user-friendly error messages
    let userMessage = error.message;
    if (error.response && error.response.text) {
      userMessage = `Brevo API error: ${error.response.text}`;
    } else if (error.code === 'ESOCKET' || error.code === 'ENETUNREACH') {
      userMessage = 'Network error. Please check your internet connection.';
    } else if (error.code === 'ETIMEDOUT') {
      userMessage = 'Connection timed out. Please check your internet connection.';
    }

    res.status(500).json({
      success: false,
      error: userMessage,
      code: error.code
    });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Email server is running' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`\n✉️  Email server running on port ${PORT}`);
  console.log(`📧 Using Brevo SMTP Relay`);
  console.log(`🚀 300 emails/day free - works on any network!`);
  console.log(`✅ No authentication popup - works immediately!`);
  console.log(`\n🌐 Open in browser: http://localhost:${PORT}\n`);
});
