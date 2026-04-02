<?php

namespace App\Http\Controllers;

use App\Mail\BookingFormMail;
use App\Mail\BookingThankYouMail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Mail;

class BookingController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'service'         => ['required', 'string', 'in:shared,private,cityToCity,event'],
            'firstName'       => ['required', 'string', 'max:100'],
            'lastName'        => ['required', 'string', 'max:100'],
            'countryCode'     => ['required', 'string', 'max:10'],
            'phone'           => ['required', 'string', 'max:20'],
            'email'           => ['required', 'email:rfc,dns', 'max:255'],
            'pickupLocation'  => ['required', 'string', 'max:255'],
            'dropoffLocation' => ['required', 'string', 'max:255'],
            'date'            => ['required', 'date', 'after_or_equal:today'],
            'time'            => ['required', 'string', 'max:10'],
            'passengers'      => ['required', 'integer', 'min:1', 'max:20'],
            'flightNumber'    => ['nullable', 'string', 'max:20'],
            'message'         => ['nullable', 'string', 'max:2000'],
            'recaptcha'       => ['required', 'string'],
            '_honey'          => ['prohibited'],
        ]);

        // Verify reCAPTCHA token with Google
        $recaptchaResponse = Http::asForm()->post('https://www.google.com/recaptcha/api/siteverify', [
            'secret'   => config('services.recaptcha.secret'),
            'response' => $validated['recaptcha'],
            'remoteip' => $request->ip(),
        ]);

        if (! $recaptchaResponse->json('success')) {
            return back()->withErrors(['recaptcha' => 'reCAPTCHA verification failed. Please try again.']);
        }

        $serviceLabels = [
            'shared'      => 'Shared Airport Transfer',
            'private'     => 'Private Airport Transfer',
            'cityToCity'  => 'City to City Transfer',
            'event'       => 'Event Transport',
        ];

        $data = [
            'service'         => $serviceLabels[$validated['service']] ?? $validated['service'],
            'firstName'       => $validated['firstName'],
            'lastName'        => $validated['lastName'],
            'email'           => $validated['email'],
            'phone'           => $validated['countryCode'] . ' ' . $validated['phone'],
            'pickupLocation'  => $validated['pickupLocation'],
            'dropoffLocation' => $validated['dropoffLocation'],
            'date'            => $validated['date'],
            'time'            => $validated['time'],
            'passengers'      => $validated['passengers'],
            'flightNumber'    => $validated['flightNumber'] ?? null,
            'message'         => $validated['message'] ?? null,
        ];

        // Notify business
        Mail::to(config('mail.to_address', 'contact@vectorshuttle.co.nz'))
            ->send(new BookingFormMail($data));

        // Thank-you to client
        Mail::to($data['email'])
            ->send(new BookingThankYouMail($data));

        return back()->with('success', 'Your booking request has been submitted! We\'ll contact you shortly to confirm.');
    }
}
