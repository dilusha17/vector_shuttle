<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ContactThankYouMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public array $data) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Thank You for Reaching Out – Vector Shuttle',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.contact-thankyou',
            with: ['data' => $this->data],
        );
    }
}
