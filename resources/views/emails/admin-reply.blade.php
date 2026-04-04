<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Re: Your Enquiry – Vector Shuttle</title>
  <style>
    body { margin: 0; padding: 0; background-color: #0f1117; font-family: Arial, sans-serif; }
    .wrapper { max-width: 600px; margin: 40px auto; background-color: #1a1d26; border: 1px solid #2a2d3a; border-radius: 12px; overflow: hidden; }
    .header { background: linear-gradient(135deg, #0ea5e9, #06b6d4); padding: 40px; text-align: center; }
    .header h1 { margin: 0; color: #ffffff; font-size: 26px; font-weight: 700; }
    .header p { margin: 8px 0 0; color: rgba(255,255,255,0.85); font-size: 15px; }
    .body { padding: 40px; }
    .body p { color: #cbd5e1; font-size: 15px; line-height: 1.75; margin: 0 0 16px; }
    .reply-box { background-color: #0f1117; border: 1px solid #2a2d3a; border-left: 4px solid #0ea5e9; border-radius: 8px; padding: 20px 24px; margin: 24px 0; color: #e2e8f0; font-size: 15px; line-height: 1.75; white-space: pre-wrap; }
    .original-box { background-color: #0d1117; border: 1px solid #2a2d3a; border-radius: 8px; padding: 16px 20px; margin: 24px 0; }
    .original-box p { color: #64748b; font-size: 13px; margin: 0; line-height: 1.6; }
    .original-label { color: #475569; font-size: 11px; text-transform: uppercase; letter-spacing: 0.06em; font-weight: 700; margin-bottom: 8px; }
    .cta { text-align: center; margin: 32px 0 0; }
    .btn { display: inline-block; background: linear-gradient(135deg, #0ea5e9, #06b6d4); color: #ffffff; text-decoration: none; font-weight: 700; font-size: 15px; padding: 14px 36px; border-radius: 8px; }
    .footer { background-color: #0f1117; padding: 20px 40px; text-align: center; color: #475569; font-size: 12px; }
    .footer a { color: #0ea5e9; text-decoration: none; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <h1>Reply from Vector Shuttle</h1>
      <p>We've responded to your enquiry.</p>
    </div>
    <div class="body">
      <p>Hi {{ $inquiry->name }},</p>
      <p>
        Thank you for getting in touch with us. Here is our response to your enquiry:
      </p>

      <div class="reply-box">{{ $inquiry->admin_reply }}</div>

      <div class="original-box">
        <p class="original-label">Your Original Message</p>
        <p>{{ $inquiry->message }}</p>
      </div>

      <p>
        If you have any further questions, feel free to reply to this email or contact us directly.
      </p>

      <div class="cta">
        <a href="https://vectorshuttle.co.nz" class="btn">Visit Our Website</a>
      </div>
    </div>
    <div class="footer">
      &copy; {{ date('Y') }} Vector Shuttle &nbsp;·&nbsp;
      <a href="mailto:contact@vectorshuttle.co.nz">contact@vectorshuttle.co.nz</a>
      <br />Hamilton, New Zealand
    </div>
  </div>
</body>
</html>
