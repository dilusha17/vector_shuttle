<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BookingHistory extends Model
{
    public $timestamps = false;

    protected $table = 'booking_history';

    protected $fillable = [
        'booking_id',
        'action',
        'from_status',
        'to_status',
        'performed_by',
        'note',
        'created_at',
    ];

    protected $casts = [
        'created_at' => 'datetime',
    ];

    public function booking()
    {
        return $this->belongsTo(Booking::class);
    }

    public function performer()
    {
        return $this->belongsTo(User::class, 'performed_by');
    }
}
