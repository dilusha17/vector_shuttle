<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class BookingFormMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public array $data) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            replyTo: [$this->data['email']],
            subject: 'New Booking Request [' . $this->data['bookingNumber'] . '] – ' . $this->data['firstName'] . ' ' . $this->data['lastName'],
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.booking-notification',
            with: ['data' => $this->data],
        );
    }
}
