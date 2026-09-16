<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('photographer_services', function (Blueprint $table) {
            $table->id();
            $table->foreignId('photographer_profile_id')->constrained()->cascadeOnDelete();
            $table->foreignId('category_id')->nullable()->constrained()->nullOnDelete();
            $table->string('name');
            $table->text('description')->nullable();
            $table->enum('price_type', ['fixed', 'starting_from', 'custom_quote'])->default('starting_from');
            $table->decimal('price', 12, 2)->default(0);
            $table->decimal('max_price', 12, 2)->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('photographer_services');
    }
};
