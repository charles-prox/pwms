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
        Schema::create('box_locations', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('boxable_id'); // Stores the ID from either table
            $table->string('boxable_type'); // Stores the table name ('old_boxes' or 'boxes')
            $table->foreignId('location_id')->constrained('locations')->onDelete('cascade');
            $table->integer('position'); // 1 to 9
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('box_locations');
    }
};
