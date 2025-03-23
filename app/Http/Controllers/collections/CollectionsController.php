<?php

namespace App\Http\Controllers\collections;

use App\Enum\CategoriesEnum;
use App\Models\Products;

use App\Http\Controllers\Controller;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

use Inertia\Inertia;

use Laravel\Cashier\Cashier;

class CollectionsController extends Controller
{
    public function index(Request $request, $any = null)
    {
        switch ($any) {
            case null:
                // means no path, just the base url, so we can return the default view
                return Inertia::render('collections/index');
            case 'sharing_boxes':
            case 'breakfast':
            case 'lunch':
            case 'sweets_cakes':
                return Inertia::render('collections/slug_category/index', [
                    'category' => CategoriesEnum::from($any)->label(),
                    'category_slug' => $any,
                ]);

            default:
                // if the path is not found, we can return an exception to 404, since we already handle the page there
                return abort(404);
        }
    }

    public function retrieve(Request $request, $category, $page = 0): JsonResponse
    {
        $products = $this->getProducts($category, $page);

        return response()->json($products);
    }

    private function getProducts($category, $page = 0)
    {
        $DB_PRODUCTS = Products::where('category_id', $category)
            ->where('active', true)
            ->paginate(10, ['*'], 'page', $page)
            ->through(function ($product) {
                $PRICE_STRIPE_SEARCH = Cashier::stripe()->prices->retrieve($product->product_stripe_price);
                $PRODUCT_STRIPE_SEARCH = Cashier::stripe()->products->retrieve($product->product_stripe_id);

                $CURRENCY = $PRICE_STRIPE_SEARCH->currency;
                $DEFAULT_IMAGE = $PRODUCT_STRIPE_SEARCH->images[0] ?? null;

                return [
                    'product_id' => $product->product_stripe_id,
                    'name' => $product->product_stripe_name,
                    'description' => $PRICE_STRIPE_SEARCH->nickname,
                    'price_id' => $product->product_stripe_price,
                    'price' => $PRICE_STRIPE_SEARCH->unit_amount,
                    'currency' => $CURRENCY,
                    'bought' => $product->bought,
                    'stock_available' => $product->stock > 0,
                    'nutrition' => $product->nutrition,
                    'default_image' => $DEFAULT_IMAGE,
                    'created_at' => $product->created_at,
                ];
            });

        return $DB_PRODUCTS;
    }
}
