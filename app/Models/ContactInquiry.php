<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ContactInquiry extends Model
{
    protected $fillable = [
        'name',
        'email',
        'phone',
        'service_type',
        'message',
        'is_read',
        'admin_reply',
        'admin_reply_at',
    ];

    protected $casts = [
        'is_read'        => 'boolean',
        'admin_reply_at' => 'datetime',
    ];
}
