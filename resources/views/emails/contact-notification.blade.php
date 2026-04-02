<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>New Contact Enquiry</title>
  <style>
    body { margin: 0; padding: 0; background-color: #0f1117; font-family: Arial, sans-serif; }
    .wrapper { max-width: 600px; margin: 40px auto; background-color: #1a1d26; border: 1px solid #2a2d3a; border-radius: 12px; overflow: hidden; }
    .header { background: linear-gradient(135deg, #0ea5e9, #06b6d4); padding: 32px 40px; }
    .header h1 { margin: 0; color: #ffffff; font-size: 22px; font-weight: 700; }
    .header p { margin: 6px 0 0; color: rgba(255,255,255,0.85); font-size: 14px; }
    .body { padding: 36px 40px; }
    .body h2 { margin: 0 0 24px; color: #e2e8f0; font-size: 18px; font-weight: 600; }
    .field { margin-bottom: 18px; }
    .field label { display: block; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #64748b; margin-bottom: 4px; }
    .field span { display: block; color: #e2e8f0; font-size: 15px; }
    .divider { border: none; border-top: 1px solid #2a2d3a; margin: 24px 0; }
    .message-box { background-color: #0f1117; border: 1px solid #2a2d3a; border-radius: 8px; padding: 16px 20px; color: #cbd5e1; font-size: 14px; line-height: 1.6; white-space: pre-wrap; }
    .footer { background-color: #0f1117; padding: 20px 40px; text-align: center; color: #475569; font-size: 12px; }
    .badge { display: inline-block; background-color: #0ea5e9; color: #ffffff; font-size: 12px; font-weight: 600; padding: 3px 10px; border-radius: 20px; margin-bottom: 8px; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <h1>Vector Shuttle</h1>
      <p>New Contact Enquiry Received</p>
    </div>
    <div class="body">
      <span class="badge">Contact Form</span>
      <h2>Enquiry Details</h2>

      <div class="field">
        <label>Full Name</label>
        <span>{{ $data['name'] }}</span>
      </div>

      <div class="field">
        <label>Email Address</label>
        <span><a href="mailto:{{ $data['email'] }}" style="color:#0ea5e9;">{{ $data['email'] }}</a></span>
      </div>

      <div class="field">
        <label>Phone Number</label>
        <span>{{ $data['phone'] }}</span>
      </div>

      <div class="field">
        <label>Service Type</label>
        <span>{{ $data['serviceType'] }}</span>
      </div>

      <hr class="divider" />

      <div class="field">
        <label>Message</label>
        <div class="message-box">{{ $data['message'] }}</div>
      </div>
    </div>
    <div class="footer">
      &copy; {{ date('Y') }} Vector Shuttle · contact@vectorshuttle.co.nz
    </div>
  </div>
</body>
</html>
