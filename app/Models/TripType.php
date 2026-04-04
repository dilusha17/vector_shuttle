<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TripType extends Model
{
    public $timestamps = false;

    protected $table = 'trip_type';

    protected $fillable = ['name'];
}
