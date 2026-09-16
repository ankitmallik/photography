<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('portfolio_media', function (Blueprint $table) {
            $table->id();
            $table->foreignId('portfolio_id')->constrained()->cascadeOnDelete();
            $table->enum('media_type', ['image', 'video'])->default('image');
            $table->string('file_path');
            $table->string('thumbnail_path')->nullable();
            $table->string('title')->nullable();
            $table->integer('sort_order')->default(0);
            $table->boolean('is_cover')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('portfolio_media');
    }
};
