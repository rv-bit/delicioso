<?php

namespace App\Http\Controllers\admin;

use App\Models\Products;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use Inertia\Inertia;
use Inertia\Response;

use Laravel\Cashier\Cashier;

class AdminProductsController extends Controller
{
    public function index(Request $request): Response
    {
        $data = $this->getStripeAllProducts();

        return Inertia::render('profile/admin/dashboard', [
            'products' => $data['products'],
            'prices' => $data['prices']
        ]);
    }

    public function createProduct(Request $request)
    {
        $PRICES = json_decode(stripslashes($request->prices), true);
        $META_DATA = json_decode(stripslashes($request->metadata), true);
        $MARKETING_FEATURES = json_decode(stripslashes($request->marketing_features), true);

        $PRODUCT = Cashier::stripe()->products->create([
            'name' => $request->name,
            'description' => $request->description,
            'images' => $this->processImage($request) ?? [],
            'type' => 'good', // means it's a physical product
            'metadata' => $META_DATA,
            'marketing_features' => $MARKETING_FEATURES
        ]);

        $DEFAULT_PRICE_OBJECT = current(array_filter($PRICES, function ($price) {
            return $price['default'] ?? false;
        }));

        $DEFAULT_PRICE = Cashier::stripe()->prices->create([
            'currency' => $DEFAULT_PRICE_OBJECT['currency'],
            'unit_amount_decimal' => $DEFAULT_PRICE_OBJECT['unit_amount_decimal'],
            'nickname' => !empty($DEFAULT_PRICE_OBJECT['options']['description']) ? $DEFAULT_PRICE_OBJECT['options']['description'] : $PRODUCT->name,
            'lookup_key' => !empty($DEFAULT_PRICE_OBJECT['options']['lookup_key']) ? $DEFAULT_PRICE_OBJECT['options']['lookup_key'] : $PRODUCT->id . '-' . 'default',
            'product' => $PRODUCT->id,
        ]);

        Cashier::stripe()->products->update($PRODUCT->id, [
            'default_price' => $DEFAULT_PRICE->id
        ]);

        $PRICES = array_filter($PRICES, function ($price) {
            return !$price['default'];
        });

        foreach ($PRICES as $price) {
            $index = array_search($price, $PRICES);

            Cashier::stripe()->prices->create([
                'currency' => $price['currency'],
                'unit_amount_decimal' => $price['unit_amount_decimal'],
                'nickname' => !empty($price['options']['description']) ? $price['options']['description'] : $PRODUCT->name,
                'lookup_key' => !empty($price['options']['lookup_key']) ? $price['options']['lookup_key'] : $PRODUCT->id . '-' . $index,
                'product' => $PRODUCT->id,
            ]);
        }

        Products::create([
            'product_stripe_id' => $PRODUCT->id,
            'product_stripe_name' => $PRODUCT->name,
            'product_stripe_description' => $PRODUCT->description,
            'product_stripe_price' => $DEFAULT_PRICE->id,
            'stock' => intval($request->stock),
            'category_id' => $request->category,
            'active' => 1,
            'bought' => 0
        ]);

        return to_route('admin.dashboard');
    }

    public function updateArchiveProduct(Request $request)
    {
        $id = $request->id;
        $actived = json_decode(stripslashes($request->actived), true);

        $stripe_product_search = Cashier::stripe()->products->retrieve($id);
        if ($stripe_product_search) {
            try {
                Cashier::stripe()->products->update($id, [
                    'active' => $actived
                ]);

                $product = Products::where('product_stripe_id', $id)->first();
                if ($product) {
                    $product->update([
                        'active' => $actived
                    ]);
                }
            } catch (\Throwable $th) {
                return redirect()->back()->withErrors(['error' => $th->getMessage()]);
            }
        }

        return to_route('admin.dashboard');
    }

    public function updateArchivePrice(Request $request)
    {
        $id = $request->id;
        $actived = json_decode(stripslashes($request->actived), true);

        $stripe_product_search = Cashier::stripe()->prices->retrieve($id);
        if ($stripe_product_search) {
            try {
                Cashier::stripe()->prices->update($id, [
                    'active' => $actived
                ]);
            } catch (\Throwable $th) {
                return redirect()->back()->withErrors(['error' => $th->getMessage()]);
            }
        }

        return to_route('admin.dashboard');
    }

    private function processImage(Request $request): ?array
    {
        if (!$request->hasFile('images')) {
            return null;
        }

        $imageUrls = [];

        foreach ($request->file('images') as $image) {
            $path = $image->storePublicly('public', 's3');
            $imageUrls[] = env("AWS_CLOUDFRONT_URL") . $path;
        }

        return $imageUrls;
    }

    private function getStripeAllProducts()
    {
        $products = Cashier::stripe()->products->all(['limit' => 100]);
        $prices = Cashier::stripe()->prices->all(['limit' => 100]);

        foreach ($products as $product) {
            $nestedPrice = Cashier::stripe()->prices->search([
                'query' => "product:'{$product->id}'"
            ]);

            $product->custom_nested_price = [];

            foreach ($nestedPrice->data as $price) {
                $product->custom_nested_price[] = [
                    'id' => $price->id,
                    'unit_amount_decimal' => $price->unit_amount_decimal,
                    'currency' => $price->currency,
                    'default' => $price->id === $product->default_price
                ];
            }
        }

        return [
            'products' => $products->data,
            'prices' => $prices->data
        ];
    }
}
