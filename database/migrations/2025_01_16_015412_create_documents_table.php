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
            $table->bigInteger('box_id');
            $table->foreign('box_id')->references('id')->on('boxes');
            $table->bigInteger('rds_id');
            $table->foreign('rds_id')->references('id')->on('rds');
            $table->string('document_code', 50);
            $table->text('description')->nullable();
            $table->date('document_date');
            $table->date('disposal_date');
            $table->bigInteger('office_id');
            $table->foreign('office_id')->references('id')->on('offices');
            $table->string('status', 20);
            $table->timestamp('created-at')->default('NOW()');
            $table->bigInteger('created_by');
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
