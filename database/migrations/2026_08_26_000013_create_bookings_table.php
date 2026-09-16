<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('bookings', function (Blueprint $table) {
            $table->id();
            $table->string('booking_number', 40)->unique()->index();
            $table->foreignId('customer_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('photographer_profile_id')->constrained()->cascadeOnDelete();
            $table->foreignId('package_id')->nullable()->constrained('photographer_packages')->nullOnDelete();
            $table->string('event_type')->index();
            $table->date('event_date')->index();
            $table->time('start_time')->nullable();
            $table->time('end_time')->nullable();
            $table->text('event_location');
            $table->string('city')->index();
            $table->string('state')->nullable();
            $table->integer('guest_count')->nullable();
            $table->decimal('package_price', 12, 2)->default(0);
            $table->decimal('addons_total', 12, 2)->default(0);
            $table->decimal('travel_charges', 12, 2)->default(0);
            $table->foreignId('coupon_id')->nullable()->constrained('coupons')->nullOnDelete();
            $table->decimal('discount_amount', 12, 2)->default(0);
            $table->decimal('gross_amount', 12, 2)->default(0);
            $table->decimal('advance_amount', 12, 2)->default(0);
            $table->decimal('remaining_amount', 12, 2)->default(0);
            $table->decimal('paid_amount', 12, 2)->default(0);
            $table->enum('booking_status', [
                'pending',
                'accepted',
                'rejected',
                'confirmed',
                'in_progress',
                'completed',
                'cancelled'
            ])->default('pending')->index();
            $table->enum('payment_status', [
                'unpaid',
                'partial',
                'paid',
                'refunded'
            ])->default('unpaid')->index();
            $table->text('special_instructions')->nullable();
            $table->text('rejection_reason')->nullable();
            $table->text('cancellation_reason')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bookings');
    }
};
