<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('bookings', function (Blueprint $table) {
            $table->id();
            $table->string('booking_number')->unique();
            $table->unsignedBigInteger('clients_id');
            $table->unsignedBigInteger('service_id');
            $table->unsignedBigInteger('trip_type_id');
            $table->date('date');
            $table->string('time');
            $table->string('pickup_location');
            $table->string('dropoff_location');
            $table->date('return_date')->nullable();
            $table->string('return_time')->nullable();
            $table->string('return_pickup_location')->nullable();
            $table->string('return_dropoff_location')->nullable();
            $table->integer('passengers');
            $table->string('flight_number')->nullable();
            $table->text('message')->nullable();
            $table->decimal('quoted_amount', 8, 2)->nullable();
            $table->string('status')->default('pending');
            $table->unsignedBigInteger('processed_by')->nullable();
            $table->timestamp('processed_at')->nullable();
            $table->timestamps();

            $table->foreign('clients_id')->references('id')->on('clients')->onDelete('cascade');
            $table->foreign('service_id')->references('id')->on('services')->onDelete('cascade');
            $table->foreign('trip_type_id')->references('id')->on('trip_type')->onDelete('cascade');
            $table->foreign('processed_by')->references('id')->on('users')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bookings');
    }
};
