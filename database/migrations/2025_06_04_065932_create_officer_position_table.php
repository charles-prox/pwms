<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('officer_position', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('officer_id');
            $table->unsignedBigInteger('position_id');

            $table->foreign('officer_id')->references('id')->on('officers')->onDelete('cascade');
            $table->foreign('position_id')->references('id')->on('positions')->onDelete('restrict');

            $table->unique(['officer_id', 'position_id']); // prevent duplicates
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('officer_position');
    }
};
