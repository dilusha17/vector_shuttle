<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Your Shuttle Booking Quotation – Vector Shuttle</title>
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
    .price-box { background: linear-gradient(135deg, rgba(14,165,233,0.15), rgba(6,182,212,0.1)); border: 1px solid rgba(14,165,233,0.4); border-radius: 8px; padding: 20px 24px; margin: 24px 0; text-align: center; }
    .price-label { color: #94a3b8; font-size: 13px; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 8px; }
    .price-amount { color: #0ea5e9; font-size: 36px; font-weight: 800; }
    .price-currency { font-size: 20px; vertical-align: super; }
    .note { background-color: #0c2231; border-left: 4px solid #0ea5e9; border-radius: 4px; padding: 14px 18px; color: #94a3b8; font-size: 13px; line-height: 1.6; margin: 20px 0 0; }
    .cta { text-align: center; margin: 32px 0 0; }
    .footer { background-color: #0f1117; padding: 20px 40px; text-align: center; color: #475569; font-size: 12px; }
    .footer a { color: #0ea5e9; text-decoration: none; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <h1>Your Quotation is Ready!</h1>
      <p>Here are the details for your shuttle booking.</p>
    </div>
    <div class="body">
      <p>Hi {{ $booking->first_name }},</p>
      <p>
        Thank you for choosing Vector Shuttle. We have reviewed your booking request and are pleased to provide you with a quotation. Please review the details and pricing below.
      </p>

      <div class="summary">
        <table>
          <tr><td class="label">Service</td><td class="value">{{ $booking->service }}</td></tr>
          <tr><td class="label">Pick-up</td><td class="value">{{ $booking->pickup_location }}</td></tr>
          <tr><td class="label">Drop-off</td><td class="value">{{ $booking->dropoff_location }}</td></tr>
          <tr><td class="label">Date</td><td class="value">{{ $booking->date->format('D, d M Y') }}</td></tr>
          <tr><td class="label">Time</td><td class="value">{{ $booking->time }}</td></tr>
          <tr><td class="label">Passengers</td><td class="value">{{ $booking->passengers }}</td></tr>
          @if($booking->flight_number)
          <tr><td class="label">Flight</td><td class="value">{{ $booking->flight_number }}</td></tr>
          @endif
        </table>
      </div>

      <div class="price-box">
        <div class="price-label">Quoted Amount</div>
        <div class="price-amount"><span class="price-currency">NZD $</span>{{ number_format($booking->quoted_amount, 2) }}</div>
      </div>

      <div class="note">
        <strong>To confirm your booking:</strong> Simply reply to this email confirming you accept the quoted amount. Once we receive your reply, we will finalise your booking and send you a confirmation.
      </div>
    </div>
    <div class="footer">
      <p>
        <a href="https://vectorshuttle.co.nz">vectorshuttle.co.nz</a> &nbsp;•&nbsp;
        <a href="mailto:contact@vectorshuttle.co.nz">contact@vectorshuttle.co.nz</a>
      </p>
      <p style="margin-top:8px;">© {{ date('Y') }} Vector Shuttle. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
