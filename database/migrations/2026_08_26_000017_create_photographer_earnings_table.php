<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('photographer_earnings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('photographer_profile_id')->constrained()->cascadeOnDelete();
            $table->foreignId('booking_id')->constrained()->cascadeOnDelete();
            $table->foreignId('payment_id')->nullable()->constrained()->nullOnDelete();
            $table->decimal('gross_amount', 12, 2);
            $table->decimal('commission_rate', 5, 2); // e.g. 10.00%
            $table->decimal('commission_amount', 12, 2);
            $table->decimal('net_amount', 12, 2);
            $table->enum('status', ['pending', 'available', 'paid_out'])->default('available')->index();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('photographer_earnings');
    }
};
