<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Thank You – Vector Shuttle</title>
  <style>
    body { margin: 0; padding: 0; background-color: #0f1117; font-family: Arial, sans-serif; }
    .wrapper { max-width: 600px; margin: 40px auto; background-color: #1a1d26; border: 1px solid #2a2d3a; border-radius: 12px; overflow: hidden; }
    .header { background: linear-gradient(135deg, #0ea5e9, #06b6d4); padding: 40px; text-align: center; }
    .header h1 { margin: 0; color: #ffffff; font-size: 26px; font-weight: 700; }
    .header p { margin: 8px 0 0; color: rgba(255,255,255,0.85); font-size: 15px; }
    .body { padding: 40px; }
    .body p { color: #cbd5e1; font-size: 15px; line-height: 1.75; margin: 0 0 16px; }
    .summary { background-color: #0f1117; border: 1px solid #2a2d3a; border-radius: 8px; padding: 20px 24px; margin: 24px 0; }
    .summary table { width: 100%; border-collapse: collapse; font-size: 14px; }
    .summary td { padding: 8px 0; border-bottom: 1px solid #2a2d3a; vertical-align: top; }
    .summary tr:last-child td { border-bottom: none; }
    .summary td.label { color: #64748b; font-weight: 600; text-transform: uppercase; font-size: 11px; letter-spacing: 0.06em; padding-right: 16px; white-space: nowrap; width: 35%; }
    .summary td.value { color: #e2e8f0; text-align: right; }
    .cta { text-align: center; margin: 32px 0 0; }
    .btn { display: inline-block; background: linear-gradient(135deg, #0ea5e9, #06b6d4); color: #ffffff; text-decoration: none; font-weight: 700; font-size: 15px; padding: 14px 36px; border-radius: 8px; }
    .footer { background-color: #0f1117; padding: 20px 40px; text-align: center; color: #475569; font-size: 12px; }
    .footer a { color: #0ea5e9; text-decoration: none; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <h1>Thank You, {{ $data['name'] }}!</h1>
      <p>We've received your message and we'll be in touch shortly.</p>
    </div>
    <div class="body">
      <p>Hi {{ $data['name'] }},</p>
      <p>
        Thank you for reaching out to Vector Shuttle. We've received your enquiry and a member of our team will respond to you as soon as possible — typically within a few hours during business hours.
      </p>

      <div class="summary">
        <table>
          <tr><td class="label">Service</td><td class="value">{{ $data['serviceType'] }}</td></tr>
          <tr><td class="label">Phone</td><td class="value">{{ $data['phone'] }}</td></tr>
        </table>
      </div>

      <p>
        In the meantime, if you have any urgent enquiries please call us directly or visit our website.
      </p>

      <div class="cta">
        <a href="https://vectorshuttle.co.nz" class="btn" style="color:#ffffff;text-decoration:none;">Visit Our Website</a>
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
