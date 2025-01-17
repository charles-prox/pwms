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
            $table->integer('item_no');
            $table->text('title_description');
            $table->integer('active')->nullable();
            $table->integer('storage')->nullable();
            $table->text('remarks');
            $table->string('department', 50);
            $table->string('rds_group', 5);
            $table->unsignedBigInteger('parent_id')->nullable();
            $table->foreign('parent_id')->references('id')->on('rds');
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
