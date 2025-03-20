<?php

use App\Enum\PermissionsEnum;
use App\Enum\RolesEnum;

use App\Http\Controllers\root\RootController;
use App\Http\Controllers\collections\CollectionsController;

use App\Http\Controllers\profile\ProfileController;
use App\Http\Controllers\profile\DashboardController;
use App\Http\Controllers\admin\AdminProductsController;

use App\Http\Controllers\stripe\CheckoutController;

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [RootController::class, 'index'])->name('root');

Route::prefix('collections')->group(
    function () {
        Route::get('/{any?}', [CollectionsController::class, 'index'])
            ->where('any', '.*')
            ->name('collections');
    }
);

Route::middleware('auth')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('profile.dashboard');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::middleware('verified', 'role:' . RolesEnum::Admin->value)->group(function () { // Only verified admins can access these routes
        Route::get('/admin-dashboard', [AdminProductsController::class, 'index'])->name('admin.dashboard');
        Route::post('/admin-dashboard/stripe/create-product', [AdminProductsController::class, 'createProduct'])->name('admin.create.product');
        Route::post('/admin-dashboard/stripe/update-archive-product', [AdminProductsController::class, 'updateArchiveProduct'])->name('admin.update.archive.product');
        Route::post('/admin-dashboard/stripe/update-archive-price', [AdminProductsController::class, 'updateArchivePrice'])->name('admin.update.archive.price');
    });
});

// Payments
Route::middleware('auth')->group(
    function () {
        Route::get('payment/checkout/{product?}', [CheckoutController::class, "checkout"])->name('payment.checkout');
        Route::get('/payment/success', [CheckoutController::class, "success"])->name('payment.success');
    }
);

require __DIR__ . '/auth.php';
