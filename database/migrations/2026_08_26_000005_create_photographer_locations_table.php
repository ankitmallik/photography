<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('photographer_locations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('photographer_profile_id')->constrained()->cascadeOnDelete();
            $table->string('city')->index();
            $table->string('state')->nullable()->index();
            $table->boolean('is_primary')->default(false);
            $table->decimal('travel_fee_per_km', 8, 2)->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('photographer_locations');
    }
};
