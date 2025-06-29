<?php

use App\Http\Controllers\Main\AuthController;
use App\Http\Controllers\Main\DashboardController;
use App\Http\Controllers\Main\EmployeeController;
use App\Http\Controllers\Main\ReportController;
use Illuminate\Support\Facades\Route;

Route::get('/', fn() => redirect('dashboard'));
Route::get('login', [AuthController::class, 'loginPage'])->name('login');
Route::post('login', [AuthController::class, 'login'])->name('login.post');


Route::middleware(['auth'])->group(function () {
    Route::post('logout', [AuthController::class, 'logout'])->name('logout');
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard.index');
    Route::delete('reports/{report}/details/{detail}', [ReportController::class, 'deleteDetail'])->name('reports.details.delete');
    Route::put('reports/{report}/details/{detail}', [ReportController::class, 'updateDetail'])->name('reports.details.update');
    Route::post('reports/{report}', [ReportController::class, 'storeDetail'])->name('reports.details.store');
    Route::resource('reports', ReportController::class);
    Route::get('employees/list', [EmployeeController::class, 'list'])->name('employees.list');
});
