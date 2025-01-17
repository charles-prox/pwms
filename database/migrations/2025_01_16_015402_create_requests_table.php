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
            $table->string('request_type', 20)->comment('Storage, Withdrawal, Return, Disposal');
            $table->timestamp('request_date');
            $table->bigInteger('requested_by');
            $table->bigInteger('box_id')->nullable();
            $table->foreign('box_id')->references('id')->on('boxes');
            $table->bigInteger('document_id')->nullable();
            $table->string('status', 20)->comment('pending, approved, rejected');
            $table->boolean('is_draft')->default(true);
            $table->bigInteger('created_by');
            $table->foreign('created_by')->references('id')->on('users');
            $table->timestamp('created_at')->default('NOW()');
            $table->bigInteger('updated_by');
            $table->foreign('updated_by')->references('id')->on('users');
            $table->timestamp('updated_at')->default('NOW()');
            $table->timestamp('completed_at')->nullable();
            $table->bigInteger('completed_by');
            $table->foreign('completed_by')->references('id')->on('users');
            $table->timestamp('approved_at');
            $table->bigInteger('approved_by');
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
