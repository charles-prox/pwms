<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::disableForeignKeyConstraints();

        Schema::create('requests', function (Blueprint $table) {
            $table->id();
            $table->string('form_number', 20)->unique()->comment('Format: S-2025-001, W-2025-001, R-2025-001, D-2025-001');
            $table->string('request_type', 20)->comment('Storage, Withdrawal, Return, Disposal');
            $table->string('status', 20)->comment('draft, pending, approved, rejected');
            $table->boolean('is_draft')->default(true);
            $table->timestamp('request_date')->nullable();
            $table->bigInteger('created_by')->nullable();
            $table->foreign('created_by')->references('id')->on('users');
            $table->timestamp('created_at')->default('NOW()');
            $table->bigInteger('updated_by')->nullable();
            $table->foreign('updated_by')->references('id')->on('users');
            $table->timestamp('updated_at')->default('NOW()');
            $table->timestamp('completed_at')->nullable();
            $table->bigInteger('completed_by')->nullable();
            $table->foreign('completed_by')->references('id')->on('users');
            $table->timestamp('approved_at')->nullable();
            $table->bigInteger('approved_by')->nullable();
            $table->foreign('approved_by')->references('id')->on('users');
        });

        Schema::enableForeignKeyConstraints();
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('requests');
    }
};
