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

        Schema::create('boxes', function (Blueprint $table) {
            $table->id();
            $table->string('box_code', 50)->unique();
            $table->bigInteger('request_id');
            $table->foreign('request_id')->references('id')->on('requests');
            $table->text('remarks');
            $table->string('status', 20)->comment('stored, withdrawn, returned, disposed');
            $table->bigInteger('office_id');
            $table->foreign('office_id')->references('id')->on('offices');
            $table->string('priority_level');
            $table->date('disposal_date');
        });

        Schema::enableForeignKeyConstraints();
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('boxes');
    }
};
