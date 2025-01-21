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

        Schema::create('rds', function (Blueprint $table) {
            $table->id();
            $table->string('module', 1);
            $table->float('item_no');
            $table->text('title_description');
            $table->string('active')->nullable();
            $table->string('storage')->nullable();
            $table->text('remarks')->nullable();
            $table->string('department', 50)->nullable();
        });

        Schema::enableForeignKeyConstraints();
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rds');
    }
};
