<?php

namespace App\Listeners;

use App\Models\CheckoutSessions;
use App\Models\Products;
use Illuminate\Support\Facades\Log;
use Laravel\Cashier\Cashier;
use Laravel\Cashier\Events\WebhookReceived;

class StripeEventListener
{
    public function handle(WebhookReceived $event): void
    {
        if ($event->payload['type'] === 'checkout.session.completed') {
            $session = $event->payload['data']['object']; // Get the checkout session object
            $sessionId = $session['id']; // Extract the session ID

            $checkout = CheckoutSessions::where('stripe_session_id', $sessionId)->first();
            $checkoutSessionData = Cashier::stripe()->checkout->sessions->allLineItems($sessionId);
            $checkoutItems = $checkoutSessionData->data;

            foreach ($checkoutItems as $item) {
                $PRICE_ID = $item->price->id;
                $QUANTITY = $item->quantity;
                $DB_PRODUCT = Products::where('product_stripe_price', $PRICE_ID)->first();

                if ($DB_PRODUCT) {
                    $DB_PRODUCT->update([
                        'stock' => $DB_PRODUCT->stock - $QUANTITY
                    ]);
                }
            };

            if (!$checkout) {
                CheckoutSessions::create([
                    'stripe_session_id' => $sessionId,
                    'paid' => 'complete',
                ]);
            } else {
                $checkout->update(['paid' => 'complete']);
            }

            Log::alert('NEW CHECKOUT SUCCEEDED - Session ID: ' . $sessionId);
        }
    }
}
