<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('booking_id')->unique()->constrained()->cascadeOnDelete();
            $table->foreignId('customer_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('photographer_profile_id')->constrained()->cascadeOnDelete();
            $table->unsignedTinyInteger('rating')->default(5);
            $table->text('review_text');
            $table->text('photographer_reply')->nullable();
            $table->timestamp('replied_at')->nullable();
            $table->boolean('is_approved')->default(true)->index();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reviews');
    }
};
