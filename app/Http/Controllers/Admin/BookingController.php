<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Services\BookingService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BookingController extends Controller
{
    public function __construct(private BookingService $bookingService) {}

    public function index(Request $request)
    {
        $query = Booking::with('processor')->latest();

        if ($search = $request->get('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                    ->orWhere('last_name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        if ($status = $request->get('status')) {
            $query->where('status', $status);
        }

        if ($service = $request->get('service')) {
            $query->where('service', 'like', "%{$service}%");
        }

        $allowedSorts = ['created_at', 'date', 'status', 'service'];
        $sortBy  = in_array($request->get('sort_by'), $allowedSorts) ? $request->get('sort_by') : 'created_at';
        $sortDir = $request->get('sort_dir') === 'asc' ? 'asc' : 'desc';
        $query->orderBy($sortBy, $sortDir);

        $bookings = $query->paginate(15)->withQueryString();

        return Inertia::render('Admin/Bookings/Index', [
            'bookings' => $bookings,
            'filters'  => $request->only(['search', 'status', 'service', 'sort_by', 'sort_dir']),
            'statuses' => Booking::getStatuses(),
        ]);
    }

    public function show(Booking $booking)
    {
        $booking->load('processor');

        return Inertia::render('Admin/Bookings/Show', [
            'booking'  => $booking,
            'statuses' => Booking::getStatuses(),
        ]);
    }

    public function accept(Request $request, Booking $booking)
    {
        if ($booking->status !== Booking::STATUS_PENDING) {
            return back()->with('error', 'Only pending bookings can be accepted.');
        }

        $request->validate([
            'quoted_amount' => ['required', 'numeric', 'min:0', 'max:99999.99'],
        ]);

        $this->bookingService->acceptWithQuotation($booking, (float) $request->quoted_amount);

        return redirect()->route('admin.bookings.show', $booking)
            ->with('success', 'Quotation sent to client. Booking is now awaiting confirmation.');
    }

    public function reject(Booking $booking)
    {
        if (in_array($booking->status, [Booking::STATUS_COMPLETED, Booking::STATUS_REJECTED])) {
            return back()->with('error', 'This booking cannot be rejected in its current state.');
        }

        $this->bookingService->reject($booking);

        return redirect()->route('admin.bookings.show', $booking)
            ->with('success', 'Booking has been rejected.');
    }

    public function confirm(Booking $booking)
    {
        if ($booking->status !== Booking::STATUS_AWAITING_CONFIRMATION) {
            return back()->with('error', 'Only bookings awaiting confirmation can be confirmed.');
        }

        $this->bookingService->confirm($booking);

        return redirect()->route('admin.bookings.show', $booking)
            ->with('success', 'Booking has been confirmed.');
    }

    public function start(Booking $booking)
    {
        if ($booking->status !== Booking::STATUS_CONFIRMED) {
            return back()->with('error', 'Only confirmed bookings can be started.');
        }

        $this->bookingService->start($booking);

        return redirect()->route('admin.bookings.show', $booking)
            ->with('success', 'Booking is now ongoing.');
    }

    public function complete(Booking $booking)
    {
        if ($booking->status !== Booking::STATUS_ONGOING) {
            return back()->with('error', 'Only ongoing bookings can be completed.');
        }

        $this->bookingService->complete($booking);

        return redirect()->route('admin.bookings.show', $booking)
            ->with('success', 'Booking has been completed.');
    }
}
