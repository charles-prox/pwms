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

        Schema::create('documents', function (Blueprint $table) {
            $table->id();
            $table->string('document_code')->unique();
            $table->bigInteger('box_id');
            $table->foreign('box_id')->references('id')->on('boxes');
            $table->bigInteger('rds_id');
            $table->foreign('rds_id')->references('id')->on('rds');
            $table->date('document_date_from')->nullable();
            $table->date('document_date_to')->nullable();
            $table->date('disposal_date')->nullable();
            $table->string('status', 20);
            $table->timestamp('added_at')->useCurrent();
            $table->string('added_by');
            $table->foreign('added_by')->references('hris_id')->on('users');
            $table->boolean('is_permanent')->default(false);
            $table->timestamps();
        });

        Schema::enableForeignKeyConstraints();
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('documents');
    }
};
