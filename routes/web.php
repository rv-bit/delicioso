<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\stripe\CheckoutController;

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('landing/Index');
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// Payments
Route::middleware('auth')->group(
    function () {
        Route::get('payment/checkout/{item?}', CheckoutController::class)->name('payment.checkout');
        Route::get('/payment/success', function () {
            return Inertia::render('orders/Success');
        })->name('payment.success');
    }
);
require __DIR__ . '/auth.php';
