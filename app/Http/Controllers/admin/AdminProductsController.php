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
        $DATA = $this->getStripeAllProducts();

        return Inertia::render('profile/admin/dashboard', [
            'products' => $DATA['products'],
            'prices' => $DATA['prices']
        ]);
    }

    public function createProduct(Request $request)
    {
        $PRICES = json_decode(stripslashes($request->prices), true);

        $PRODUCT = Cashier::stripe()->products->create([
            'name' => $request->name,
            'description' => $request->description,
            'images' => $this->processImage($request) ?? [],
            'type' => 'good', // means it's a physical product
        ]);

        $DEFAULT_PRICE_OBJECT = current(array_filter($PRICES, function ($price) {
            return $price['default'] ?? false;
        }));

        $PRICES = array_filter($PRICES, function ($price) {
            return !$price['default'];
        });

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
        $ID = $request->id;
        $ACTIVATED = json_decode(stripslashes($request->ACTIVATED), true);

        $STRIPE_PRODUCT = Cashier::stripe()->products->retrieve($ID);
        if ($STRIPE_PRODUCT) {
            try {
                Cashier::stripe()->products->update($ID, [
                    'active' => $ACTIVATED
                ]);

                $PRODUCT = Products::where('product_stripe_id', $ID)->first();
                if ($PRODUCT) {
                    $PRODUCT->update([
                        'active' => $ACTIVATED
                    ]);
                }
            } catch (\Throwable $th) {
                return redirect()->back()->withErrors(['error' => $th->getMessage()]);
            }
        }

        return to_route('admin.dashboard');
    }

    public function updateProduct(Request $request)
    {
        $ID = $request->id;
        $PRODUCT_STRIPE = Cashier::stripe()->products->retrieve($ID);
        $PRODUCT = Products::where('product_stripe_id', $ID)->first();
        if (!$PRODUCT_STRIPE || !$PRODUCT) {
            return redirect()->back()->withErrors(['error' => 'Product not found']);
        }

        $NAME = $request->name;
        $DESCRIPTION = $request->description;
        $CATEGORY = $request->category;
        $STOCK = intval($request->stock);
        $PRICES = json_decode(stripslashes($request->prices), true);
        $ADDITIONAL_IMAGES = $this->processImage($request);
        $REMOVED_IMAGES = $request->removed_images;

        // dd($request->all());

        Cashier::stripe()->products->update($ID, [
            'name' => $NAME,
            'description' => $DESCRIPTION,
        ]);

        $PRODUCT->update([
            'product_stripe_name' => $NAME,
            'product_stripe_description' => $DESCRIPTION,
            'category_id' => $CATEGORY,
            'stock' => $STOCK
        ]);

        if (!empty($REMOVED_IMAGES)) {
            $PRODUCT_IMAGES = array_values(array_filter($PRODUCT_STRIPE->images, function ($image) use ($REMOVED_IMAGES) {
                return !in_array($image, $REMOVED_IMAGES);
            }));

            Cashier::stripe()->products->update($ID, [
                'images' => $PRODUCT_IMAGES
            ]);
        }

        if ($ADDITIONAL_IMAGES) {
            $PRODUCT_STRIPE = Cashier::stripe()->products->retrieve($ID); // re-fetch the product to make sure we get the last change
            $PRODUCT_IMAGES = array_merge($PRODUCT_STRIPE->images, $ADDITIONAL_IMAGES);

            Cashier::stripe()->products->update($ID, [
                'images' => $PRODUCT_IMAGES
            ]);
        }

        $CURRENT_PRICE_DEFAULT_ID = $PRODUCT_STRIPE->default_price;

        $DEFAULT_PRICE = current(array_filter($PRICES, function ($price) {
            return $price['default'] ?? false;
        }));

        // means that if the new price default is going to not change then we dont need to update the price
        $NEW_DEFAULT_PRICE_STRIPE = [
            'id' => $CURRENT_PRICE_DEFAULT_ID
        ];

        // means that the new price is hasn't been created yet
        if (empty($DEFAULT_PRICE['price_id'])) {
            $NEW_DEFAULT_PRICE_STRIPE = Cashier::stripe()->prices->create([
                'currency' => $DEFAULT_PRICE['currency'],
                'unit_amount_decimal' => $DEFAULT_PRICE['unit_amount_decimal'],
                'nickname' => !empty($DEFAULT_PRICE['options']['description']) ? $DEFAULT_PRICE['options']['description'] : $NAME,
                'product' => $ID,
            ]);

            Cashier::stripe()->products->update($ID, [
                'default_price' => $NEW_DEFAULT_PRICE_STRIPE->id
            ]);

            $PRODUCT->update([
                'product_stripe_price' => $NEW_DEFAULT_PRICE_STRIPE->id
            ]);
        } else {
            $NEW_DEFAULT_PRICE_STRIPE = Cashier::stripe()->prices->retrieve($DEFAULT_PRICE['price_id']);

            Cashier::stripe()->products->update($ID, [
                'default_price' => $NEW_DEFAULT_PRICE_STRIPE->id
            ]);

            $PRODUCT->update([
                'product_stripe_price' => $NEW_DEFAULT_PRICE_STRIPE->id
            ]);
        }

        // means that the new price is not the same as the old price
        if (is_array($NEW_DEFAULT_PRICE_STRIPE)) {
            $NEW_DEFAULT_PRICE_STRIPE_ID = $NEW_DEFAULT_PRICE_STRIPE['id'];
        } else {
            $NEW_DEFAULT_PRICE_STRIPE_ID = $NEW_DEFAULT_PRICE_STRIPE->id;
        }

        if ($NEW_DEFAULT_PRICE_STRIPE_ID !== $CURRENT_PRICE_DEFAULT_ID) {
            Cashier::stripe()->prices->update($CURRENT_PRICE_DEFAULT_ID, [
                'lookup_key' => $ID . '-' . 'temp',
            ]);

            Cashier::stripe()->prices->update($NEW_DEFAULT_PRICE_STRIPE_ID, [
                'lookup_key' => $ID . '-' . 'default',
            ]);

            Cashier::stripe()->prices->update($CURRENT_PRICE_DEFAULT_ID, [
                'lookup_key' => $ID . '-' . 'old-default',
            ]);
        }

        $PRICES = array_filter($PRICES, function ($price) {
            return !$price['default'];
        });

        foreach ($PRICES as $price) {
            $INDEX = array_search($price, $PRICES);
            if (empty($price['price_id'])) {
                Cashier::stripe()->prices->create([
                    'currency' => $price['currency'],
                    'unit_amount_decimal' => $price['unit_amount_decimal'],
                    'nickname' => !empty($price['options']['description']) ? $price['options']['description'] : $NAME,
                    'lookup_key' => !empty($price['options']['lookup_key']) ? $price['options']['lookup_key'] : $ID . '-' . $price['price_id'] . '-' . $INDEX,
                    'product' => $ID,
                ]);
            } else {
                $PRICE_EXISTS = Cashier::stripe()->prices->retrieve($price['price_id']);
                if ($PRICE_EXISTS) {
                    if (!empty($price['edited_lookup_key']) && $price['edited_lookup_key'] === true) {
                        Cashier::stripe()->prices->update($PRICE_EXISTS->id, [
                            'lookup_key' => $price['lookup_key'],
                        ]);
                    }

                    Cashier::stripe()->prices->update($PRICE_EXISTS->id, [
                        'nickname' => !empty($price['options']['description']) ? $price['options']['description'] : $NAME,
                    ]);
                }
            }
        }

        return to_route('admin.dashboard');
    }

    private function processImage(Request $request): ?array
    {
        if (!$request->hasFile('images')) {
            return null;
        }

        $IMAGE_URLS = [];

        foreach ($request->file('images') as $image) {
            $PATH = $image->storePublicly('public', 's3');
            $IMAGE_URLS[] = env("AWS_CLOUDFRONT_URL") . $PATH;
        }

        return $IMAGE_URLS;
    }

    private function getStripeAllProducts()
    {
        $PRODUCTS = Cashier::stripe()->products->all(['limit' => 100]);
        $PRICES = Cashier::stripe()->prices->all(['limit' => 100]);

        foreach ($PRODUCTS as $product) {
            $nestedPrice = Cashier::stripe()->prices->search([
                'query' => "product:'{$product->id}'"
            ]);

            $product->category = Products::where('product_stripe_id', $product->id)->first()->category_id ?? null;
            $product->stock = Products::where('product_stripe_id', $product->id)->first()->stock ?? null;

            $product->prices = [];
            foreach ($nestedPrice->data as $price) {
                $product->prices[] = [
                    'price_id' => $price->id,
                    'name' => $price->nickname,
                    'type' => $price->type,
                    'unit_amount_decimal' => $price->unit_amount_decimal,
                    'currency' => strtoupper($price->currency),
                    'options' => [
                        'description' => $price->nickname,
                        'lookup_key' => $price->lookup_key
                    ],
                    'default' => $price->id === $product->default_price
                ];
            }
        }

        return [
            'products' => $PRODUCTS->data,
            'prices' => $PRICES->data
        ];
    }
}
