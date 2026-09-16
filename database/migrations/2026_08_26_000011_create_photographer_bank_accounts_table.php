<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('photographer_bank_accounts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('photographer_profile_id')->constrained()->cascadeOnDelete();
            $table->string('account_holder_name');
            $table->string('account_number');
            $table->string('ifsc_code');
            $table->string('bank_name');
            $table->string('upi_id')->nullable();
            $table->boolean('is_primary')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('photographer_bank_accounts');
    }
};
