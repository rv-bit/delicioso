<?php

namespace App\Http\Controllers\admin;

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
        $product = Cashier::stripe()->products->create([
            'name' => $request->name,
            'description' => $request->description,
            'images' => $this->processImage($request) ?? [],
            'type' => 'good', // means it's a physical product
            // 'metadata' => $request->metadata,
            // 'marketing_features' => $request->marketing_features,
        ]);

        $price = Cashier::stripe()->prices->create([
            'currency' => 'gbp',
            'unit_amount_decimal' => $request->unit_amount_decimal,
            'product' => $product->id,
        ]);

        Cashier::stripe()->products->update($product->id, [
            'default_price' => $price->id
        ]);

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
        $products = Cashier::stripe()->products->all();
        $prices = Cashier::stripe()->prices->all();

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
