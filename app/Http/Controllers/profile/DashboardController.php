<?php

namespace App\Http\Controllers\profile;

use App\Http\Controllers\Controller;

use Illuminate\Http\Request;

use Inertia\Inertia;
use Inertia\Response;
use Laravel\Cashier\Cashier;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $STRIPE_CHARGERS = Cashier::stripe()->charges->all([
            'limit' => 100,
            'customer' => $request->user()->stripe_id,
        ]);
        $STRIPE_DATA = $STRIPE_CHARGERS->data;

        $charges = [];
        foreach ($STRIPE_DATA as $charge) {
            $charges[] = [
                'charge_id' => $charge->id,
                'paid' => $charge->paid,
                'amount' => $charge->amount,
                'receipt_number' => $charge->receipt_number,
                'receipt_url' => $charge->receipt_url,
                'created' => $charge->created,
            ];
        }

        return Inertia::render('profile/dashboard', [
            'charges' => $charges,
        ]);
    }
}
