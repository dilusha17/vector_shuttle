<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('booking_history', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('booking_id')->nullable();
            $table->string('action');                    // Human-readable label
            $table->string('from_status')->nullable();   // Status before action
            $table->string('to_status')->nullable();     // Status after action
            $table->unsignedBigInteger('performed_by')->nullable(); // User who performed it (null = customer)
            $table->text('note')->nullable();            // Extra info (e.g. quoted amount)
            $table->timestamp('created_at')->useCurrent();

            $table->foreign('booking_id')->references('id')->on('bookings')->onDelete('cascade');
            $table->foreign('performed_by')->references('id')->on('users')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('booking_history');
    }
};
