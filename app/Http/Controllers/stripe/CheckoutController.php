<?php

namespace App\Http\Controllers\stripe;

use App\Http\Controllers\Controller;
use App\Models\CheckoutSessions;
use App\Models\Products;
use Illuminate\Http\Request;

use Inertia\Inertia;
use Laravel\Cashier\Cashier;

class CheckoutController extends Controller
{
    public function checkItems(Request $request)
    {
        $items = $request->input('items');
        $errors = [];

        foreach ($items as $item) {
            $ITEM_PRICE_AVAILABLE = Cashier::stripe()->prices->retrieve($item['price']);
            $ITEM_PRODUCT = Cashier::stripe()->products->retrieve($ITEM_PRICE_AVAILABLE->product);
            $DB_PRODUCT = Products::where('product_stripe_id', $ITEM_PRODUCT->id)->first();

            if ($ITEM_PRICE_AVAILABLE) {
                if ($ITEM_PRICE_AVAILABLE->active === false) {
                    $errors[$item['price']]['price'] = 'This item is not available';
                }
            }

            if ($DB_PRODUCT) {
                if ($DB_PRODUCT->stock < $item['quantity']) {
                    $errors[$item['price']]['quantity'] = 'Not enough stock';
                }
            }
        }

        if (count($errors) > 0) {
            return response()->json([
                'success' => false,
                'message' => $errors
            ], 422);
        }

        return response()->json([
            'success' => true,
            'message' => 'All items are available'
        ]);
    }

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
        $sessionId = $request->get('session_id');
        $session = Cashier::stripe()->checkout->sessions->retrieve($sessionId);

        if (!$session->status !== 'expired') {
            $sessionData = Cashier::stripe()->checkout->sessions->allLineItems($sessionId);
            $sessionItems = $sessionData->data;

            $items = [];

            foreach ($sessionItems as $item) {
                $items[] = [
                    'priceId' => $item->price->id,
                ];
            };

            return Inertia::render('payments/success', [
                'sessionItems' => $items
            ]);
        }
    }
}
