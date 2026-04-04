<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\BookingHistory;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BookingHistoryController extends Controller
{
    public function index(Request $request)
    {
        $query = BookingHistory::with(['booking.client', 'performer'])
            ->orderBy('created_at', 'desc');

        if ($search = $request->get('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('action', 'like', "%{$search}%")
                  ->orWhere('note', 'like', "%{$search}%")
                  ->orWhereHas('performer', fn ($u) => $u->where('name', 'like', "%{$search}%"))
                  ->orWhereHas('booking', fn ($b) => $b->where('booking_number', 'like', "%{$search}%"))
                  ->orWhereHas('booking.client', fn ($c) => $c->where('first_name', 'like', "%{$search}%")
                      ->orWhere('last_name', 'like', "%{$search}%"));

                if (is_numeric($search)) {
                    $q->orWhere('booking_id', (int) $search);
                }
            });
        }

        if ($bookingId = $request->get('booking_id')) {
            $query->where('booking_id', $bookingId);
        }

        $history = $query->paginate(25)->withQueryString();

        return Inertia::render('Admin/History/Index', [
            'history'  => $history,
            'filters'  => [
                'search'     => $request->get('search'),
                'booking_id' => $request->get('booking_id'),
            ],
        ]);
    }
}
