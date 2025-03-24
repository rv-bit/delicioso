<?php

namespace App\Http\Controllers\stripe;

use App\Http\Controllers\Controller;

use Illuminate\Http\Request;

use Inertia\Inertia;

use Laravel\Cashier\Cashier;

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
                'success_url' => route('payment.success') . '?session_id={CHECKOUT_SESSION_ID}',
                'cancel_url' => route('profile.dashboard'),
                'shipping_address_collection' => [
                    'allowed_countries' => ['GB'],
                ],
                'customer_update' => [
                    'name' => 'auto',
                    'address' => 'auto',
                    'shipping' => 'auto'
                ]
            ]
        );

        return Inertia::location($checkout->url);
    }

    public function success(Request $request)
    {
        $session_id = $request->get('session_id');

        if (empty($session_id)) {
            return response()->json(['error' => 'The session ID cannot be null or whitespace.'], 400);
        }

        try {
            $checkoutSession = $request->user()->stripe()->checkout->sessions->retrieve($session_id);
            $line_items = Cashier::stripe()->checkout->sessions->allLineItems($session_id, ['limit' => 100]);

            return Inertia::render('orders/success', [
                'checkoutSession' => $checkoutSession,
                'line_items' => $line_items
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
