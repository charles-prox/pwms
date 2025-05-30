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
        Schema::create('old_boxes', function (Blueprint $table) {
            $table->id();
            $table->string('box_code', 50)->unique();
            $table->text('details');
            $table->string('status', 20)
                ->comment('stored, withdrawn, returned, disposed')
                ->check("status IN ('stored', 'withdrawn', 'returned', 'disposed')");
            $table->bigInteger('office_id');
            $table->foreign('office_id')->references('id')->on('offices');
            $table->string('priority_level')
                ->comment('red, green, black')
                ->check("status IN ('red, green, black')");
            $table->date('disposal_date');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('old_boxes');
    }
};
