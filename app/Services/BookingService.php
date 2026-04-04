<?php

namespace App\Services;

use App\Mail\QuotationMail;
use App\Models\Booking;
use App\Models\BookingHistory;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;

class BookingService
{
    private function recordHistory(Booking $booking, string $action, ?string $fromStatus, ?string $toStatus, ?string $note = null): void
    {
        BookingHistory::create([
            'booking_id'   => $booking->id,
            'action'       => $action,
            'from_status'  => $fromStatus,
            'to_status'    => $toStatus,
            'performed_by' => Auth::id(),
            'note'         => $note,
            'created_at'   => now(),
        ]);
    }

    public function acceptWithQuotation(Booking $booking, float $amount): void
    {
        $from = $booking->status;

        $booking->update([
            'status'        => Booking::STATUS_AWAITING_CONFIRMATION,
            'quoted_amount' => $amount,
            'processed_by'  => Auth::id(),
            'processed_at'  => now(),
        ]);

        $this->recordHistory($booking, 'Quotation Sent', $from, Booking::STATUS_AWAITING_CONFIRMATION, "Quoted NZD \${$amount}");

        Mail::to($booking->email)->send(new QuotationMail($booking));
    }

    public function reject(Booking $booking): void
    {
        $from = $booking->status;

        $booking->update([
            'status'       => Booking::STATUS_REJECTED,
            'processed_by' => Auth::id(),
            'processed_at' => now(),
        ]);

        $this->recordHistory($booking, 'Booking Rejected', $from, Booking::STATUS_REJECTED);
    }

    public function confirm(Booking $booking): void
    {
        $from = $booking->status;

        $booking->update([
            'status'       => Booking::STATUS_CONFIRMED,
            'processed_by' => Auth::id(),
            'processed_at' => now(),
        ]);

        $this->recordHistory($booking, 'Booking Confirmed', $from, Booking::STATUS_CONFIRMED);
    }

    public function start(Booking $booking): void
    {
        $from = $booking->status;

        $booking->update([
            'status'       => Booking::STATUS_ONGOING,
            'processed_by' => Auth::id(),
            'processed_at' => now(),
        ]);

        $this->recordHistory($booking, 'Trip Started', $from, Booking::STATUS_ONGOING);
    }

    public function complete(Booking $booking): void
    {
        $from = $booking->status;

        $booking->update([
            'status'       => Booking::STATUS_COMPLETED,
            'processed_by' => Auth::id(),
            'processed_at' => now(),
        ]);

        $this->recordHistory($booking, 'Trip Completed', $from, Booking::STATUS_COMPLETED);
    }
}
