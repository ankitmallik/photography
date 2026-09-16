<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('favorites', function (Blueprint $table) {
            $table->id();
            $table->foreignId('customer_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('photographer_profile_id')->constrained()->cascadeOnDelete();
            $table->timestamps();

            $table->unique(['customer_id', 'photographer_profile_id'], 'fav_cust_photog_unique');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('favorites');
    }
};
