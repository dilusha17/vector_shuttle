<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Booking Request Received – Vector Shuttle</title>
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
    .summary td { padding: 9px 0; border-bottom: 1px solid #2a2d3a; vertical-align: top; }
    .summary tr:last-child td { border-bottom: none; }
    .summary td.label { color: #64748b; font-weight: 600; text-transform: uppercase; font-size: 11px; letter-spacing: 0.06em; padding-right: 16px; white-space: nowrap; width: 35%; }
    .summary td.value { color: #e2e8f0; text-align: right; }
    .cta { text-align: center; margin: 32px 0 0; }
    .btn { display: inline-block; background: linear-gradient(135deg, #0ea5e9, #06b6d4); color: #ffffff; text-decoration: none; font-weight: 700; font-size: 15px; padding: 14px 36px; border-radius: 8px; }
    .note { background-color: #0c2231; border-left: 4px solid #0ea5e9; border-radius: 4px; padding: 14px 18px; color: #94a3b8; font-size: 13px; line-height: 1.6; margin: 20px 0 0; }
    .footer { background-color: #0f1117; padding: 20px 40px; text-align: center; color: #475569; font-size: 12px; }
    .footer a { color: #0ea5e9; text-decoration: none; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <h1>Booking Received!</h1>
      <p>We're on it, {{ $data['firstName'] }}.</p>
    </div>
    <div class="body">
      <p>Hi {{ $data['firstName'] }},</p>
      <p>
        Thank you for choosing Vector Shuttle! We've received your booking request and our team will contact you shortly to confirm your ride and provide any additional details.
      </p>

      <div class="summary">
        <table>
          <tr><td class="label">Service</td><td class="value">{{ $data['service'] }}</td></tr>
          <tr><td class="label">Pick-up</td><td class="value">{{ $data['pickupLocation'] }}</td></tr>
          <tr><td class="label">Drop-off</td><td class="value">{{ $data['dropoffLocation'] }}</td></tr>
          <tr><td class="label">Date</td><td class="value">{{ \Carbon\Carbon::parse($data['date'])->format('D, d M Y') }}</td></tr>
          <tr><td class="label">Time</td><td class="value">{{ $data['time'] }}</td></tr>
          <tr><td class="label">Passengers</td><td class="value">{{ $data['passengers'] }}</td></tr>
          @if($data['flightNumber'])
          <tr><td class="label">Flight</td><td class="value">{{ $data['flightNumber'] }}</td></tr>
          @endif
        </table>
      </div>

      <div class="note">
        <strong>Please note:</strong> This is a request confirmation, not a final booking. A team member will reach out to you at <strong>{{ $data['phone'] }}</strong> or reply to this email to confirm availability and pricing.
      </div>

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
