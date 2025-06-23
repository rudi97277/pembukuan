<?php

use App\Http\Controllers\Main\ReportController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', fn() => redirect('/dashboard'));
Route::get('/dashboard', function () {
    return Inertia::render('dashboard');
})->name('dashboard');

Route::put('reports/{report}/details/{detail}', [ReportController::class, 'updateDetail'])->name('reports.details.update');
Route::post('reports/{report}', [ReportController::class, 'storeDetail'])->name('reports.details.store');
Route::resource('reports', ReportController::class);
