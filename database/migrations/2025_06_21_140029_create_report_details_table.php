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
        Schema::create('report_details', function (Blueprint $table) {
            $table->id();
            $table->foreignId('report_id')->references('id')->on('reports');
            $table->date('date');
            $table->foreignId('employee_id')->references('id')->on('employees');
            $table->integer('quantity')->default(1);
            $table->enum('breakfast', [Employee::MEAL, Employee::SAVE])->nullable();
            $table->enum('lunch', [Employee::MEAL, Employee::SAVE])->nullable();
            $table->enum('dinner', [Employee::MEAL, Employee::SAVE])->nullable();
            $table->boolean('is_claim_save')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('report_details');
    }
};
