<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $stats = [
            'total'                 => Booking::count(),
            'pending'               => Booking::where('status', Booking::STATUS_PENDING)->count(),
            'accepted'              => Booking::where('status', Booking::STATUS_ACCEPTED)->count(),
            'awaiting_confirmation' => Booking::where('status', Booking::STATUS_AWAITING_CONFIRMATION)->count(),
            'confirmed'             => Booking::where('status', Booking::STATUS_CONFIRMED)->count(),
            'ongoing'               => Booking::where('status', Booking::STATUS_ONGOING)->count(),
            'completed'             => Booking::where('status', Booking::STATUS_COMPLETED)->count(),
            'rejected'              => Booking::where('status', Booking::STATUS_REJECTED)->count(),
        ];

        $recentBookings = Booking::with('processor')
            ->latest()
            ->take(8)
            ->get()
            ->map(fn ($b) => [
                'id'         => $b->id,
                'full_name'  => $b->full_name,
                'service'    => $b->service,
                'date'       => $b->date->format('d M Y'),
                'status'     => $b->status,
                'created_at' => $b->created_at->format('d M Y, H:i'),
            ]);

        $statusBreakdown = Booking::selectRaw('status, count(*) as count')
            ->groupBy('status')
            ->pluck('count', 'status')
            ->toArray();

        return Inertia::render('Admin/Dashboard', [
            'stats'           => $stats,
            'recentBookings'  => $recentBookings,
            'statusBreakdown' => $statusBreakdown,
        ]);
    }
}
