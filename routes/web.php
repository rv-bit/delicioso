<?php

use App\Enum\PermissionsEnum;
use App\Enum\RolesEnum;

use App\Http\Controllers\root\RootController;
use App\Http\Controllers\collections\CollectionsController;
use App\Http\Controllers\product\ProductController;

use App\Http\Controllers\profile\ProfileController;
use App\Http\Controllers\profile\DashboardController;
use App\Http\Controllers\admin\AdminProductsController;
use App\Http\Controllers\admin\AdminPricesController;

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
Route::get('/api/collections/{category}/{page?}', [CollectionsController::class, 'retrieve'])->name('api.collections.products');

Route::get('p/{product_slug?}', [ProductController::class, 'index'])->name('product');

Route::get('cart', function () {
    return Inertia::render('cart/index');
})->name('cart');

// Payments
Route::middleware('auth')->group(
    function () {
        Route::post('/payment/checkout', [CheckoutController::class, "checkout"])->name('payment.checkout');
        Route::get('/payment/success', [CheckoutController::class, "success"])->name('payment.success');
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
        Route::post('/admin-dashboard/stripe/update-product', [AdminProductsController::class, 'updateProduct'])->name('admin.update.product');
        Route::post('/admin-dashboard/stripe/update-archive-product', [AdminProductsController::class, 'updateArchiveProduct'])->name('admin.update.archive.product');

        Route::post('/admin-dashboard/stripe/update-price', [AdminPricesController::class, 'updatePrice'])->name('admin.update.price');
        Route::post('/admin-dashboard/stripe/update-archive-price', [AdminPricesController::class, 'updateArchivePrice'])->name('admin.update.archive.price');
        Route::post('/admin-dashboard/stripe/check-price-lookup', [AdminPricesController::class, 'checkPriceLookupKey'])->name('admin.check.prices');
    });
});

require __DIR__ . '/auth.php';
