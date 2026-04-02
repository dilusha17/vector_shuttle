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
            $table->string('service');
            $table->string('first_name');
            $table->string('last_name');
            $table->string('phone');
            $table->string('email');
            $table->string('pickup_location');
            $table->string('dropoff_location');
            $table->date('date');
            $table->string('time');
            $table->integer('passengers');
            $table->string('flight_number')->nullable();
            $table->text('message')->nullable();
            $table->string('status')->default('pending');
            $table->decimal('quoted_amount', 8, 2)->nullable();
            $table->foreignId('processed_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamp('processed_at')->nullable();
            $table->timestamps();
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
