<?php

namespace App\Models;

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

    /**
     * Appended attributes serialised to JSON (sent to frontend).
     * Keep accessor-computed strings lean â€” relationships are loaded separately.
     */
    protected $appends = ['full_name', 'service_name', 'trip_type_name', 'is_two_way'];

    protected $fillable = [
        'booking_number',
        'clients_id',
        'service_id',
        'trip_type_id',
        'date',
        'time',
        'pickup_location',
        'dropoff_location',
        'return_date',
        'return_time',
        'return_pickup_location',
        'return_dropoff_location',
        'passengers',
        'flight_number',
        'message',
        'quoted_amount',
        'status',
        'processed_by',
        'processed_at',
    ];

    protected $casts = [
        'date'          => 'date',
        'return_date'   => 'date',
        'passengers'    => 'integer',
        'quoted_amount' => 'decimal:2',
        'processed_at'  => 'datetime',
    ];

    // â”€â”€ Relationships â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

    public function client()
    {
        return $this->belongsTo(Client::class, 'clients_id');
    }

    public function bookingService()
    {
        return $this->belongsTo(Service::class, 'service_id');
    }

    public function tripType()
    {
        return $this->belongsTo(TripType::class, 'trip_type_id');
    }

    public function processor()
    {
        return $this->belongsTo(User::class, 'processed_by');
    }

    public function history()
    {
        return $this->hasMany(BookingHistory::class)->orderBy('created_at', 'asc');
    }

    // â”€â”€ Appended accessors (included in JSON serialisation) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

    public function getFullNameAttribute(): string
    {
        return $this->getRelationValue('client')?->full_name ?? '';
    }

    public function getServiceNameAttribute(): string
    {
        return $this->getRelationValue('bookingService')?->name ?? '';
    }

    public function getTripTypeNameAttribute(): ?string
    {
        return $this->getRelationValue('tripType')?->name;
    }

    public function getIsTwoWayAttribute(): bool
    {
        return $this->getRelationValue('tripType')?->name === 'Two-Way';
    }

    // â”€â”€ Non-appended accessors (used in PHP / Blade only) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

    public function getFirstNameAttribute(): string
    {
        return $this->client?->first_name ?? '';
    }

    public function getEmailAttribute(): string
    {
        return $this->client?->email ?? '';
    }

    // â”€â”€ Helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

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
}
