<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>New Booking Request</title>
  <style>
    body { margin: 0; padding: 0; background-color: #0f1117; font-family: Arial, sans-serif; }
    .wrapper { max-width: 600px; margin: 40px auto; background-color: #1a1d26; border: 1px solid #2a2d3a; border-radius: 12px; overflow: hidden; }
    .header { background: linear-gradient(135deg, #0ea5e9, #06b6d4); padding: 32px 40px; }
    .header h1 { margin: 0; color: #ffffff; font-size: 22px; font-weight: 700; }
    .header p { margin: 6px 0 0; color: rgba(255,255,255,0.85); font-size: 14px; }
    .body { padding: 36px 40px; }
    .body h2 { margin: 0 0 20px; color: #e2e8f0; font-size: 18px; font-weight: 600; }
    .section-title { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #0ea5e9; margin: 24px 0 12px; }
    .field { margin-bottom: 14px; }
    .field label { display: block; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #64748b; margin-bottom: 3px; }
    .field span { display: block; color: #e2e8f0; font-size: 15px; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0 24px; }
    .divider { border: none; border-top: 1px solid #2a2d3a; margin: 20px 0; }
    .message-box { background-color: #0f1117; border: 1px solid #2a2d3a; border-radius: 8px; padding: 14px 18px; color: #cbd5e1; font-size: 14px; line-height: 1.6; white-space: pre-wrap; }
    .badge { display: inline-block; background-color: #0ea5e9; color: #ffffff; font-size: 12px; font-weight: 600; padding: 3px 10px; border-radius: 20px; margin-bottom: 8px; }
    .footer { background-color: #0f1117; padding: 20px 40px; text-align: center; color: #475569; font-size: 12px; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <h1>Vector Shuttle</h1>
      <p>New Booking Request Received</p>
      <p style="margin:10px 0 0;font-size:16px;font-weight:700;letter-spacing:0.05em;color:#fff;">{{ $data['bookingNumber'] }}</p>
    </div>
    <div class="body">
      <span class="badge">{{ $data['service'] }}</span>
      @if(!empty($data['tripDirection']))
      <span class="badge" style="background:#0f766e;color:#fff;display:inline-block;padding:4px 12px;border-radius:9999px;font-size:13px;margin-left:6px;">{{ $data['tripDirection'] }}</span>
      @endif
      @if(!empty($data['tripType']))
      <span class="badge" style="background:#7c3aed;color:#fff;display:inline-block;padding:4px 12px;border-radius:9999px;font-size:13px;margin-left:6px;">{{ $data['tripType'] === 'two_way' ? 'Two Way' : 'One Way' }}</span>
      @endif
      <h2>Booking Details</h2>

      <p class="section-title">Customer Information</p>
      <div class="grid">
        <div class="field">
          <label>First Name</label>
          <span>{{ $data['firstName'] }}</span>
        </div>
        <div class="field">
          <label>Last Name</label>
          <span>{{ $data['lastName'] }}</span>
        </div>
        <div class="field">
          <label>Email Address</label>
          <span><a href="mailto:{{ $data['email'] }}" style="color:#0ea5e9;">{{ $data['email'] }}</a></span>
        </div>
        <div class="field">
          <label>Phone Number</label>
          <span>{{ $data['phone'] }}</span>
        </div>
      </div>

      <hr class="divider" />

      <p class="section-title">Outbound Trip</p>
      <div class="grid">
        <div class="field">
          <label>Pick-up Location</label>
          <span>{{ $data['pickupLocation'] }}</span>
        </div>
        <div class="field">
          <label>Drop-off Location</label>
          <span>{{ $data['dropoffLocation'] }}</span>
        </div>
        <div class="field">
          <label>Date</label>
          <span>{{ \Carbon\Carbon::parse($data['date'])->format('D, d M Y') }}</span>
        </div>
        <div class="field">
          <label>Time</label>
          <span>{{ $data['time'] }}</span>
        </div>
        <div class="field">
          <label>Passengers</label>
          <span>{{ $data['passengers'] }}</span>
        </div>
        @if(!empty($data['flightNumber']))
        <div class="field">
          <label>Flight Number</label>
          <span>{{ $data['flightNumber'] }}</span>
        </div>
        @endif
      </div>

      @if(!empty($data['returnDate']))
      <hr class="divider" />
      <p class="section-title" style="color:#7c3aed;">Return Trip</p>
      <div class="grid">
        <div class="field">
          <label>Return Pick-up</label>
          <span>{{ $data['returnPickupLocation'] }}</span>
        </div>
        <div class="field">
          <label>Return Drop-off</label>
          <span>{{ $data['returnDropoffLocation'] }}</span>
        </div>
        <div class="field">
          <label>Return Date</label>
          <span>{{ \Carbon\Carbon::parse($data['returnDate'])->format('D, d M Y') }}</span>
        </div>
        <div class="field">
          <label>Return Time</label>
          <span>{{ $data['returnTime'] }}</span>
        </div>
      </div>
      @endif

      @if($data['message'])
      <hr class="divider" />
      <div class="field">
        <label>Additional Notes</label>
        <div class="message-box">{{ $data['message'] }}</div>
      </div>
      @endif
    </div>
    <div class="footer">
      &copy; {{ date('Y') }} Vector Shuttle · contact@vectorshuttle.co.nz
    </div>
  </div>
</body>
</html>
