<?php

namespace App\Http\Controllers\stripe;

use App\Http\Controllers\Controller;
use App\Models\CheckoutSessions;

use Illuminate\Http\Request;

use Inertia\Inertia;

class CheckoutController extends Controller
{
    public function checkout(Request $request)
    {
        $items = $request->input('items');
        $line_items = [];

        foreach ($items as $item) {
            $decoded_item = json_decode($item, true);
            $line_items[] = [
                'price' => $decoded_item['price'],
                'quantity' => $decoded_item['quantity'],
            ];
        }

        $checkout = $request->user()->checkout(
            $line_items,
            [
                'success_url' => route('payment.success'),
                'cancel_url' => route('profile.dashboard'),
                'shipping_address_collection' => [
                    'allowed_countries' => ['GB'],
                ],
                'customer_update' => [
                    'name' => 'auto',
                    'address' => 'auto',
                    'shipping' => 'auto'
                ],
                'payment_method_types' => [
                    'card'
                ],
                'expires_at' => time() + (30 * 60)
            ]
        );

        return Inertia::location($checkout->url);
    }

    public function success(Request $request)
    {
        return redirect()->route('profile.dashboard')->with('successPayment', true);
    }
}
