<?php

namespace App\Http\Controllers\stripe;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CheckoutController extends Controller
{
    public function checkout(Request $request, string $product)
    {
        $checkout = $request->user()->checkout([$product => 1], [
            'success_url' => route('payment.success'),
            'cancel_url' => route('profile.dashboard'),
        ]);

        return Inertia::location($checkout->url);
    }

    public function success()
    {
        return Inertia::render('orders/success');
    }
}
