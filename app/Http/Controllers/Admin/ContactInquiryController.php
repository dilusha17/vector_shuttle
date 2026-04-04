<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Mail\AdminReplyMail;
use App\Models\ContactInquiry;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

class ContactInquiryController extends Controller
{
    public function index(Request $request)
    {
        $query = ContactInquiry::latest();

        if ($search = $request->get('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('message', 'like', "%{$search}%")
                  ->orWhere('service_type', 'like', "%{$search}%");
            });
        }

        if ($filter = $request->get('filter')) {
            if ($filter === 'unread') {
                $query->where('is_read', false);
            } elseif ($filter === 'read') {
                $query->where('is_read', true);
            } elseif ($filter === 'replied') {
                $query->whereNotNull('admin_reply');
            }
        }

        $inquiries   = $query->paginate(20)->withQueryString();
        $unreadCount = ContactInquiry::where('is_read', false)->count();

        return Inertia::render('Admin/Messages/Index', [
            'inquiries'   => $inquiries,
            'filters'     => [
                'search' => $request->get('search'),
                'filter' => $request->get('filter'),
            ],
            'unreadCount' => $unreadCount,
        ]);
    }

    public function show(ContactInquiry $inquiry)
    {
        if (! $inquiry->is_read) {
            $inquiry->update(['is_read' => true]);
        }

        return Inertia::render('Admin/Messages/Show', [
            'inquiry' => $inquiry->fresh(),
        ]);
    }

    public function reply(Request $request, ContactInquiry $inquiry)
    {
        $request->validate([
            'reply' => ['required', 'string', 'max:5000'],
        ]);

        $inquiry->update([
            'admin_reply'    => $request->reply,
            'admin_reply_at' => now(),
            'is_read'        => true,
        ]);

        Mail::to($inquiry->email)
            ->send(new AdminReplyMail($inquiry));

        return back()->with('success', 'Reply sent to ' . $inquiry->name . '.');
    }
}
