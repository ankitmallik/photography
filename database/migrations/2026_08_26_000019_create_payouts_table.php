<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payouts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('photographer_profile_id')->constrained()->cascadeOnDelete();
            $table->decimal('amount', 12, 2);
            $table->enum('payout_method', ['bank_transfer', 'upi'])->default('bank_transfer');
            $table->json('payout_account_details')->nullable();
            $table->enum('status', ['pending', 'processing', 'completed', 'rejected'])->default('pending')->index();
            $table->text('admin_notes')->nullable();
            $table->string('transaction_reference')->nullable();
            $table->timestamp('requested_at')->useCurrent();
            $table->timestamp('processed_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payouts');
    }
};
