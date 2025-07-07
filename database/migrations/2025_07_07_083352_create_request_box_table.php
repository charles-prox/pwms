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
            $table->text('withdrawal_remarks')->nullable();
            $table->text('return_remarks')->nullable();
            $table->text('disposal_remarks')->nullable();

            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('request_box');
    }
}
