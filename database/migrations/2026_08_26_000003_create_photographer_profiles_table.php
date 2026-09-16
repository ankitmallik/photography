<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('photographer_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('business_name')->index();
            $table->string('display_name')->nullable();
            $table->string('slug')->unique();
            $table->string('tagline')->nullable();
            $table->text('bio')->nullable();
            $table->integer('experience_years')->default(1);
            $table->string('profile_image')->nullable();
            $table->string('cover_image')->nullable();
            $table->text('address')->nullable();
            $table->string('city')->nullable()->index();
            $table->string('state')->nullable()->index();
            $table->string('pincode', 20)->nullable();
            $table->decimal('latitude', 10, 7)->nullable();
            $table->decimal('longitude', 10, 7)->nullable();
            $table->enum('verification_status', ['pending', 'approved', 'rejected', 'suspended'])->default('pending')->index();
            $table->text('rejection_reason')->nullable();
            $table->enum('profile_status', ['active', 'inactive'])->default('active')->index();
            $table->boolean('is_featured')->default(false)->index();
            $table->date('featured_until')->nullable();
            $table->decimal('starting_price', 12, 2)->default(0)->index();
            $table->decimal('max_price', 12, 2)->default(0);
            $table->decimal('average_rating', 3, 2)->default(0.00)->index();
            $table->integer('review_count')->default(0)->index();
            $table->integer('total_bookings')->default(0)->index();
            $table->integer('completion_percentage')->default(20);
            $table->json('social_links')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('photographer_profiles');
    }
};
