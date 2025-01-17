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

        Schema::create('location', function (Blueprint $table) {
            $table->id();
            $table->integer('floor');
            $table->integer('rack');
            $table->integer('bay');
            $table->integer('level');
            $table->bigInteger('position');
            $table->integer('capacity');
            $table->integer('current_boxes');
        });

        Schema::enableForeignKeyConstraints();
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('location');
    }
};
