<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::disableForeignKeyConstraints();

        Schema::create('requests', function (Blueprint $table) {
            $table->id();
            $table->string('form_number', 20)->unique()->comment('Format: S-2025-001, etc.');
            $table->string('request_type', 20)->comment('storage, withdrawal, return, disposal');

            $table->string('status', 30)->default('draft')->comment('Current status'); // moved tracking to logs
            $table->boolean('is_draft')->default(true);

            $table->foreignId('office_id')->nullable()->constrained('offices')->nullOnDelete();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('updated_by')->nullable()->constrained('users')->nullOnDelete();

            $table->timestamp('submitted_at')->nullable();
            $table->timestamps();

            $table->unsignedSmallInteger('form_year');
            $table->unsignedInteger('form_sequence');
            $table->unique(['request_type', 'form_year', 'form_sequence']);


            $table->string('pdf_path')->nullable();
        });

        Schema::enableForeignKeyConstraints();
    }

    public function down(): void
    {
        Schema::dropIfExists('requests');
    }
};
