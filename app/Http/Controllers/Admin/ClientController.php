<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Client;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ClientController extends Controller
{
    public function index(Request $request)
    {
        $query = Client::withCount('bookings')->latest();

        if ($search = $request->get('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                  ->orWhere('last_name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        $clients = $query->paginate(20)->withQueryString();

        return Inertia::render('Admin/Clients/Index', [
            'clients' => $clients,
            'filters' => [
                'search' => $request->get('search'),
            ],
        ]);
    }

    public function show(Client $client)
    {
        $client->load(['bookings.bookingService', 'bookings.tripType']);

        return Inertia::render('Admin/Clients/Show', [
            'client' => $client,
        ]);
    }
}
