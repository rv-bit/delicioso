<?php

namespace App\Http\Controllers\admin;

use App\Models\Products;

use App\Http\Controllers\Controller;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

use Laravel\Cashier\Cashier;

class AdminPricesController extends Controller
{
    public function updatePrice(Request $request)
    {
        $ID = $request->price_id;
        $DESCRIPTION = stripslashes($request->description);
        $LOOKUP_KEY = stripslashes($request->lookup_key);

        $STRIPE_PRODUCT = Cashier::stripe()->prices->retrieve($ID);

        if ($STRIPE_PRODUCT) {
            try {
                Cashier::stripe()->prices->update($ID, [
                    'nickname' => $DESCRIPTION,
                    'lookup_key' => $LOOKUP_KEY
                ]);
            } catch (\Throwable $th) {
                return redirect()->back()->withErrors(['error' => $th->getMessage()]);
            }
        }

        return to_route('admin.dashboard');
    }

    public function updateArchivePrice(Request $request)
    {
        $ID = $request->price_id;
        $ACTIVATED = json_decode(stripslashes($request->actived), true);

        $STRIPE_PRODUCT = Cashier::stripe()->prices->retrieve($ID);
        if ($STRIPE_PRODUCT) {
            try {
                Cashier::stripe()->prices->update($ID, [
                    'active' => $ACTIVATED
                ]);
            } catch (\Throwable $th) {
                return redirect()->back()->withErrors(['error' => $th->getMessage()]);
            }
        }

        return to_route('admin.dashboard');
    }

    public function checkPriceLookupKey(Request $request): JsonResponse
    {
        $LOOKUP_KEY = $request->lookup_key;
        $PRICE_SEARCH = Cashier::stripe()->prices->search(
            [
                'query' => "lookup_key:'{$LOOKUP_KEY}'",
                'limit' => 100
            ]
        );

        if ($PRICE_SEARCH->data) {
            return response()->json(
                [
                    'success' => false,
                    'message' => 'There is already a price with the lookup key: ' . $LOOKUP_KEY
                ],
                409
            );
        }

        return response()->json(
            [
                'success' => true,
                'message' => 'Prices checked'
            ],
            200
        );
    }
}
