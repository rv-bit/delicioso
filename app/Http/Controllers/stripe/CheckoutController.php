<?php

namespace App\Http\Controllers\stripe;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CheckoutController extends Controller
{
    public function __invoke(Request $request, string $item = 'price_1R0Y8NIv1F2scOeLeyADFSsM')
    {
        $checkout = $request->user()->checkout([$item => 1], [
            'success_url' => route('payment.success'),
            'cancel_url' => route('dashboard'),
        ]);

        return Inertia::location($checkout->url);
    }
}
