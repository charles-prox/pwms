<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('requests', function (Blueprint $table) {
            $table->string('form_number', 100)->change();
        });

        Schema::table('boxes', function (Blueprint $table) {
            $table->string('box_code', 100)->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('requests', function (Blueprint $table) {
            $table->string('form_number', 20)->change();
        });

        Schema::table('boxes', function (Blueprint $table) {
            $table->string('box_code', 20)->change();
        });
    }
};
