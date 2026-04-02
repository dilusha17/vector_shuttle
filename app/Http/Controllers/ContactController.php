<?php

namespace App\Http\Controllers;

use App\Mail\ContactFormMail;
use App\Mail\ContactThankYouMail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Mail;

class ContactController extends Controller
{
    public function send(Request $request)
    {
        $validated = $request->validate([
            'name'         => ['required', 'string', 'max:100'],
            'email'        => ['required', 'email:rfc,dns', 'max:255'],
            'countryCode'  => ['required', 'string', 'max:10'],
            'phone'        => ['required', 'string', 'max:20'],
            'serviceType'  => ['required', 'string', 'max:100'],
            'message'      => ['required', 'string', 'max:2000'],
            'recaptcha'    => ['required', 'string'],
            '_honey'       => ['prohibited'],
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

        $data = [
            'name'         => $validated['name'],
            'email'        => $validated['email'],
            'phone'        => $validated['countryCode'] . ' ' . $validated['phone'],
            'serviceType'  => $validated['serviceType'],
            'message'      => $validated['message'],
        ];

        // Notify business
        Mail::to(config('mail.to_address', 'contact@vectorshuttle.co.nz'))
            ->send(new ContactFormMail($data));

        // Thank-you to client
        Mail::to($data['email'])
            ->send(new ContactThankYouMail($data));

        return back()->with('success', 'Your message has been sent! We\'ll get back to you shortly.');
    }
}
