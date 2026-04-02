<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    const STATUS_PENDING               = 'pending';
    const STATUS_ACCEPTED              = 'accepted';
    const STATUS_AWAITING_CONFIRMATION = 'awaiting_confirmation';
    const STATUS_CONFIRMED             = 'confirmed';
    const STATUS_ONGOING               = 'ongoing';
    const STATUS_COMPLETED             = 'completed';
    const STATUS_REJECTED              = 'rejected';

    protected $appends = ['full_name'];

    protected $fillable = [
        'service',
        'first_name',
        'last_name',
        'phone',
        'email',
        'pickup_location',
        'dropoff_location',
        'date',
        'time',
        'passengers',
        'flight_number',
        'message',
        'status',
        'quoted_amount',
        'processed_by',
        'processed_at',
    ];

    protected $casts = [
        'date'         => 'date',
        'passengers'   => 'integer',
        'quoted_amount' => 'decimal:2',
        'processed_at' => 'datetime',
    ];

    public function processor()
    {
        return $this->belongsTo(User::class, 'processed_by');
    }

    protected function fullName(): Attribute
    {
        return Attribute::make(
            get: fn () => "{$this->first_name} {$this->last_name}",
        );
    }

    public static function getStatuses(): array
    {
        return [
            self::STATUS_PENDING,
            self::STATUS_ACCEPTED,
            self::STATUS_AWAITING_CONFIRMATION,
            self::STATUS_CONFIRMED,
            self::STATUS_ONGOING,
            self::STATUS_COMPLETED,
            self::STATUS_REJECTED,
        ];
    }

    public static function getStatusLabel(string $status): string
    {
        return match ($status) {
            self::STATUS_PENDING               => 'Pending',
            self::STATUS_ACCEPTED              => 'Accepted',
            self::STATUS_AWAITING_CONFIRMATION => 'Awaiting Confirmation',
            self::STATUS_CONFIRMED             => 'Confirmed',
            self::STATUS_ONGOING               => 'Ongoing',
            self::STATUS_COMPLETED             => 'Completed',
            self::STATUS_REJECTED              => 'Rejected',
            default                            => ucfirst(str_replace('_', ' ', $status)),
        };
    }
}
