<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('photographer_packages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('photographer_profile_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->string('slug')->nullable();
            $table->text('description')->nullable();
            $table->decimal('price', 12, 2)->default(0);
            $table->integer('duration_hours')->default(4);
            $table->integer('photographer_count')->default(1);
            $table->integer('videographer_count')->default(0);
            $table->integer('edited_photos_count')->default(50);
            $table->boolean('raw_photos_included')->default(true);
            $table->integer('video_duration_minutes')->default(0);
            $table->boolean('cinematic_video')->default(false);
            $table->boolean('drone')->default(false);
            $table->boolean('album')->default(false);
            $table->integer('album_pages')->default(0);
            $table->boolean('travel_included')->default(false);
            $table->json('features')->nullable();
            $table->boolean('is_active')->default(true);
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('photographer_packages');
    }
};
