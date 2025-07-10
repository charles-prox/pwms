<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateRequestBoxTable extends Migration
{
    public function up()
    {
        Schema::create('request_box', function (Blueprint $table) {
            $table->id();
            $table->foreignId('request_id')->constrained()->cascadeOnDelete();
            $table->foreignId('box_id')->constrained()->cascadeOnDelete();

            // Remarks for each type of request
            $table->text('storage_remarks')->nullable();
            $table->text('withdrawal_remarks')->nullable();
            $table->text('return_remarks')->nullable();
            $table->text('disposal_remarks')->nullable();

            // Completion Remarks for each type of request
            $table->string('storage_completion_remarks')->nullable();
            $table->string('withdrawal_completion_remarks')->nullable();
            $table->string('return_completion_remarks')->nullable();
            $table->string('disposal_completion_remarks')->nullable();

            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('request_box');
    }
}
