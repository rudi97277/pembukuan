<?php

use App\Models\Employee;
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
        Schema::create('employees', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->foreignId('division_id')->references('id')->on('divisions');
            $table->enum('type', [Employee::VENDOR, Employee::GUEST]);
            $table->boolean('is_active')->default(true);
            $table->enum('breakfast', [Employee::MEAL, Employee::SAVE])->nullable();
            $table->enum('lunch', [Employee::MEAL, Employee::SAVE])->nullable();
            $table->enum('dinner', [Employee::MEAL, Employee::SAVE])->nullable();
            $table->boolean('is_claim_save')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('employees');
    }
};
