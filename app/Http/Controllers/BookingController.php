<?php

namespace App\Http\Controllers;

use App\Mail\BookingFormMail;
use App\Mail\BookingThankYouMail;
use App\Models\Booking;
use App\Models\BookingHistory;
use App\Models\Client;
use App\Models\Service;
use App\Models\TripType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Mail;

class BookingController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'service'               => ['required', 'string', 'in:shared,private,cityToCity,event'],
            'tripDirection'         => ['nullable', 'string', 'in:arrival,departure'],
            'tripType'              => ['nullable', 'string', 'in:one_way,two_way'],
            'firstName'             => ['required', 'string', 'max:100'],
            'lastName'              => ['required', 'string', 'max:100'],
            'countryCode'           => ['required', 'string', 'max:10'],
            'phone'                 => ['required', 'string', 'max:20'],
            'email'                 => ['required', 'email:rfc,dns', 'max:255'],
            'pickupLocation'        => ['required', 'string', 'max:255'],
            'dropoffLocation'       => ['required', 'string', 'max:255'],
            'date'                  => ['required', 'date', 'after_or_equal:today'],
            'time'                  => ['required', 'string', 'max:10'],
            'returnDate'            => ['nullable', 'date', 'after_or_equal:date'],
            'returnTime'            => ['nullable', 'string', 'max:10'],
            'returnPickupLocation'  => ['nullable', 'string', 'max:255'],
            'returnDropoffLocation' => ['nullable', 'string', 'max:255'],
            'passengers'            => ['required', 'integer', 'min:1', 'max:20'],
            'flightNumber'          => ['nullable', 'string', 'max:20'],
            'message'               => ['nullable', 'string', 'max:2000'],
            'recaptcha'             => ['required', 'string'],
            '_honey'                => ['prohibited'],
        ]);

        // Verify reCAPTCHA
        $recaptchaResponse = Http::asForm()->post('https://www.google.com/recaptcha/api/siteverify', [
            'secret'   => config('services.recaptcha.secret'),
            'response' => $validated['recaptcha'],
            'remoteip' => $request->ip(),
        ]);

        if (! $recaptchaResponse->json('success')) {
            return back()->withErrors(['recaptcha' => 'reCAPTCHA verification failed. Please try again.']);
        }

        // â”€â”€ Resolve service FK â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
        $service = Service::where('key', $validated['service'])->firstOrFail();

        // â”€â”€ Resolve trip type FK â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
        $tripTypeMap = [
            'arrival'   => 'Arrival',
            'departure' => 'Departure',
            'one_way'   => 'One-Way',
            'two_way'   => 'Two-Way',
        ];

        $tripKey      = $validated['tripDirection'] ?? $validated['tripType'] ?? null;
        $tripTypeName = $tripKey ? ($tripTypeMap[$tripKey] ?? null) : null;

        if (! $tripTypeName) {
            // Fallback: airport â†’ Arrival, city/event â†’ One-Way
            $tripTypeName = in_array($validated['service'], ['shared', 'private']) ? 'Arrival' : 'One-Way';
        }

        $tripType = TripType::where('name', $tripTypeName)->firstOrFail();

        $isTwoWay = $tripTypeName === 'Two-Way';

        // -- Generate unique booking number ----------------------------------
        do {
            $bookingNumber = 'BN' . str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);
        } while (Booking::where('booking_number', $bookingNumber)->exists());

        // -- Build email data ------------------------------------------------
        $directionLabels = [
            'arrival'   => 'Arrival (Flying in)',
            'departure' => 'Departure (Flying out)',
        ];

        $data = [
            'bookingNumber'         => $bookingNumber,
            'service'               => $service->name,
            'tripDirection'         => isset($validated['tripDirection']) ? ($directionLabels[$validated['tripDirection']] ?? null) : null,
            'tripType'              => $validated['tripType'] ?? null,
            'firstName'             => $validated['firstName'],
            'lastName'              => $validated['lastName'],
            'email'                 => $validated['email'],
            'phone'                 => $validated['countryCode'] . ' ' . $validated['phone'],
            'pickupLocation'        => $validated['pickupLocation'],
            'dropoffLocation'       => $validated['dropoffLocation'],
            'date'                  => $validated['date'],
            'time'                  => $validated['time'],
            'returnDate'            => $isTwoWay ? ($validated['returnDate'] ?? null) : null,
            'returnTime'            => $isTwoWay ? ($validated['returnTime'] ?? null) : null,
            'returnPickupLocation'  => $isTwoWay ? ($validated['returnPickupLocation'] ?? null) : null,
            'returnDropoffLocation' => $isTwoWay ? ($validated['returnDropoffLocation'] ?? null) : null,
            'passengers'            => $validated['passengers'],
            'flightNumber'          => $validated['flightNumber'] ?? null,
            'message'               => $validated['message'] ?? null,
        ];

        // â”€â”€ Create client record â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
        $phone = $validated['countryCode'] . ' ' . $validated['phone'];

        $client = Client::where('email', $validated['email'])
            ->orWhere('phone', $phone)
            ->first();

        if ($client) {
            $client->update([
                'first_name' => $validated['firstName'],
                'last_name'  => $validated['lastName'],
                'phone'      => $phone,
                'email'      => $validated['email'],
            ]);
        } else {
            $client = Client::create([
                'first_name' => $validated['firstName'],
                'last_name'  => $validated['lastName'],
                'phone'      => $phone,
                'email'      => $validated['email'],
            ]);
        }

        // â”€â”€ Create booking â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
        $booking = Booking::create([
            'booking_number'          => $bookingNumber,
            'clients_id'              => $client->id,
            'service_id'              => $service->id,
            'trip_type_id'            => $tripType->id,
            'pickup_location'         => $validated['pickupLocation'],
            'dropoff_location'        => $validated['dropoffLocation'],
            'date'                    => $validated['date'],
            'time'                    => $validated['time'],
            'return_date'             => $isTwoWay ? ($validated['returnDate'] ?? null) : null,
            'return_time'             => $isTwoWay ? ($validated['returnTime'] ?? null) : null,
            'return_pickup_location'  => $isTwoWay ? ($validated['returnPickupLocation'] ?? null) : null,
            'return_dropoff_location' => $isTwoWay ? ($validated['returnDropoffLocation'] ?? null) : null,
            'passengers'              => $validated['passengers'],
            'flight_number'           => $validated['flightNumber'] ?? null,
            'message'                 => $validated['message'] ?? null,
        ]);

        // â”€â”€ Record initial history â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
        BookingHistory::create([
            'booking_id'   => $booking->id,
            'action'       => 'Booking Submitted',
            'from_status'  => null,
            'to_status'    => Booking::STATUS_PENDING,
            'performed_by' => null,
            'note'         => null,
            'created_at'   => now(),
        ]);

        // â”€â”€ Send emails â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
        Mail::to(config('mail.to_address', 'contact@vectorshuttle.co.nz'))
            ->send(new BookingFormMail($data));

        Mail::to($data['email'])
            ->send(new BookingThankYouMail($data));

        return back()->with('success', 'Your booking request has been submitted! We\'ll contact you shortly to confirm.');
    }
}
