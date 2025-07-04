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

        Schema::create('locations', function (Blueprint $table) {
            $table->id();
            $table->enum('floor', ['ground', 'mezzanine']);
            $table->integer('rack');
            $table->integer('bay');
            $table->integer('level');
            $table->integer('total_positions')->default(9); // Fixed per level
            $table->integer('capacity_per_position')->default(2); // Each position can hold 2 boxes
            $table->integer('current_boxes')->default(0); // Track occupied boxes
            $table->bigInteger('office_id')->nullable(); // Office assignment
            $table->foreign('office_id')->references('id')->on('offices')->onDelete('cascade');
            // $table->timestamps();
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
