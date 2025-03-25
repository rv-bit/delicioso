<?php

namespace App\Http\Controllers\product;

use App\Enum\CategoriesEnum;
use App\Models\Products;

use App\Http\Controllers\Controller;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

use Inertia\Inertia;

use Laravel\Cashier\Cashier;

class ProductController extends Controller
{
    public function index(Request $request, $product_id = null)
    {
        if (!$product_id) {
            return abort(404);
        }

        $product = Products::where('product_stripe_id', $product_id)->first();

        if ($product) {
            $PRICE_STRIPE_SEARCH = Cashier::stripe()->prices->retrieve($product->product_stripe_price);
            $PRODUCT_STRIPE_SEARCH = Cashier::stripe()->products->retrieve($product->product_stripe_id);

            $CURRENCY = $PRICE_STRIPE_SEARCH->currency;
            $IMAGES = $PRODUCT_STRIPE_SEARCH->images;
            $NUTRITION = [
                'calories' => $product->nutrition->calories,
                'carbs' => $product->nutrition->carbs,
                'carbs_of_sugar' => $product->nutrition->carbs_of_sugar,
                'fat' => $product->nutrition->fat,
                'fat_of_saturated' => $product->nutrition->saturated_fat,
                'proteins' => $product->nutrition->protein,
                'sodium' => $product->nutrition->sodium,
                'fiber' => $product->nutrition->fiber,
            ];

            $product = [
                'product_id' => $product->product_stripe_id,
                'product_name' => $PRODUCT_STRIPE_SEARCH->name,
                'product_description' => $PRODUCT_STRIPE_SEARCH->description,
                'product_price_id' => $product->product_stripe_price,
                'product_price' => $PRICE_STRIPE_SEARCH->unit_amount,
                'product_currency' => $CURRENCY,
                'product_images' => $IMAGES,
                'product_category_slug' => CategoriesEnum::from($product->category_id)->value,
                'product_nutrition' => $NUTRITION,
                'stock_available' => $product->stock > 0,
            ];
        }

        if (!$product) {
            return abort(404);
        }

        return Inertia::render('product/index', [
            'product' => $product,
        ]);
    }
}
