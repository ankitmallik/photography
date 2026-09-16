<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('conversations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('customer_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('photographer_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('booking_id')->nullable()->constrained('bookings')->nullOnDelete();
            $table->timestamp('last_message_at')->nullable()->index();
            $table->timestamps();

            $table->unique(['customer_id', 'photographer_id', 'booking_id'], 'conv_cust_photog_bk_unique');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('conversations');
    }
};
