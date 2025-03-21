<?php

namespace App\Http\Controllers\admin;

use App\Models\Products;

use App\Http\Controllers\Controller;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

use Laravel\Cashier\Cashier;

class AdminPricesController extends Controller
{
    public function updateArchivePrice(Request $request)
    {
        $ID = $request->id;
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

    public function checkPrices(Request $request): JsonResponse
    {
        $ID = $request->id;
        $PRODUCT_STRIPE = Cashier::stripe()->products->retrieve($ID);
        $PRODUCT = Products::where('product_stripe_id', $ID)->first();
        if (!$PRODUCT_STRIPE || !$PRODUCT) {
            return response()->json(
                [
                    'success' => false,
                    'message' => 'Product not found'
                ],
                400
            );
        }

        $PRICES = json_decode(stripslashes($request->prices), true);
        $SEARCHES = [];
        foreach ($PRICES as $price) {
            if (!empty($price['options']['lookup_key'])) {
                $PRICE_SEARCH = Cashier::stripe()->prices->search([
                    'query' => "lookup_key:'{$price['options']['lookup_key']}'",
                    'limit' => 100 // we are just going to look for as many as possible, not using page for now, but we can use it if we want
                ]);

                if ($PRICE_SEARCH->data) {
                    $SEARCHES[] = $PRICE_SEARCH->data;
                }
            }
        }

        if ($SEARCHES) {
            return response()->json(
                [
                    'success' => false,
                    'data' => array_map(function ($search) {
                        return array_map(function ($price) {
                            return 'There is a price with the lookup key: ' . $price->lookup_key;
                        }, $search);
                    }, $SEARCHES),
                ],
                200
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
