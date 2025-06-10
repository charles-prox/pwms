<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('request_status_logs', function (Blueprint $table) {
            $table->id();

            $table->foreignId('request_id')->constrained('requests')->onDelete('cascade');
            $table->string('status', 30)->comment('e.g., pending, approved, rejected, received, etc.');
            $table->text('remarks')->nullable()->comment('Optional reason or notes');

            $table->foreignId('updated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('created_at')->useCurrent();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('request_status_logs');
    }
};
