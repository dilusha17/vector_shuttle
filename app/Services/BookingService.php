<?php

namespace App\Services;

use App\Mail\QuotationMail;
use App\Models\Booking;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;

class BookingService
{
    /**
     * Accept a booking: store quoted amount, send quotation email, set status to awaiting_confirmation.
     */
    public function acceptWithQuotation(Booking $booking, float $amount): void
    {
        $booking->update([
            'status'        => Booking::STATUS_AWAITING_CONFIRMATION,
            'quoted_amount' => $amount,
            'processed_by'  => Auth::id(),
            'processed_at'  => now(),
        ]);

        Mail::to($booking->email)->send(new QuotationMail($booking));
    }

    /**
     * Reject a booking.
     */
    public function reject(Booking $booking): void
    {
        $booking->update([
            'status'       => Booking::STATUS_REJECTED,
            'processed_by' => Auth::id(),
            'processed_at' => now(),
        ]);
    }

    /**
     * Manually mark a booking as confirmed (after client replies).
     */
    public function confirm(Booking $booking): void
    {
        $booking->update([
            'status'       => Booking::STATUS_CONFIRMED,
            'processed_by' => Auth::id(),
            'processed_at' => now(),
        ]);
    }

    /**
     * Mark a booking as ongoing (trip started).
     */
    public function start(Booking $booking): void
    {
        $booking->update([
            'status'       => Booking::STATUS_ONGOING,
            'processed_by' => Auth::id(),
            'processed_at' => now(),
        ]);
    }

    /**
     * Mark a booking as completed.
     */
    public function complete(Booking $booking): void
    {
        $booking->update([
            'status'       => Booking::STATUS_COMPLETED,
            'processed_by' => Auth::id(),
            'processed_at' => now(),
        ]);
    }
}
