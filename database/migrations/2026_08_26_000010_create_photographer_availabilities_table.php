<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('photographer_availabilities', function (Blueprint $table) {
            $table->id();
            $table->foreignId('photographer_profile_id')->constrained()->cascadeOnDelete();
            $table->date('date')->index();
            $table->enum('status', ['available', 'booked', 'blocked'])->default('available')->index();
            $table->string('notes')->nullable();
            $table->timestamps();

            $table->unique(['photographer_profile_id', 'date'], 'photog_date_unique');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('photographer_availabilities');
    }
};
