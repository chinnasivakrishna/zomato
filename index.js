const express = require('express');
const bodyParser = require('body-parser');
const twilio = require('twilio');
const app = express();
const port = 3000;

// Twilio credentials
const accountSid = 'AC2d7ad48b2f8df7a819708b09965bb9b5'; // Your Account SID
const authToken = '24893fffbb2f25ce6969b51b75393612'; // Your Auth Token
const twilioPhoneNumber = '+19292369575'; // Your Twilio phone number

const client = twilio(accountSid, authToken);

app.use(bodyParser.json());

// Route to send OTP
app.post('/send-otp', async (req, res) => {
  const { phoneNumber } = req.body;
  
  // Validate phone number format
  if (!phoneNumber || phoneNumber.length < 10) {
    return res.status(400).json({ error: 'Invalid phone number' });
  }

  // Generate random OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  try {
    // Send OTP via SMS
    await client.messages.create({
      body: `Your OTP code is: ${otp}`,
      from: twilioPhoneNumber,
      to: `+${phoneNumber}`, // Ensure the phone number is in international format
    });

    console.log(`OTP sent to +${phoneNumber}`);
    
    // Return the OTP to frontend for verification (for demo purposes)
    // In production, you'd store this OTP in a session or database
    res.json({ otp });
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ error: 'Failed to send OTP' });
  }
});

// Route to verify OTP (you can expand with session or DB validation)
app.post('/verify-otp', (req, res) => {
  const { userOtp, otp } = req.body;

  if (userOtp === otp) {
    return res.json({ status: 'OTP Verified Successfully!' });
  } else {
    return res.status(400).json({ error: 'Invalid OTP' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
