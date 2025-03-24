<?php

namespace App\Http\Resources\products;

use App\Enum\CategoriesEnum;
use App\Models\Products;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Laravel\Cashier\Cashier;

class ProductsResource extends JsonResource
{
    public static $wrap = false;

    public function toArray(Request $request): array
    {
        // going to be returned from function calling the db from all products bought, and then we will get the most common category and product
        return [
            'most_common_category' => $this->getMostCommonCategory(),
            'most_common_product' => $this->getMostCommonProduct(),
            'best_seller_products' => $this->getMostCommonProducts()
        ];
    }

    private function getMostCommonCategory(): array
    {
        // grab the top 5 products based on the bought number
        $ALL_PRODUCTS = Products::orderBy('bought', 'desc')->take(5)->get();
        $categories = [];

        foreach ($ALL_PRODUCTS as $product) {
            $categories[$product->category_id] = ($categories[$product->category_id] ?? 0) + $product->bought;
        }

        arsort($categories);

        $mostCommonCategoryId = key($categories);
        $mostCommonCategoryName = CategoriesEnum::labels()[$mostCommonCategoryId];

        return [
            'category_id' => $mostCommonCategoryId,
            'category_name' => $mostCommonCategoryName
        ];
    }

    private function getMostCommonProduct(): array
    {
        // grab the top 5 products based on the bought number
        $ALL_PRODUCTS = Products::orderBy('bought', 'desc')->take(5)->get();
        $products = [];

        foreach ($ALL_PRODUCTS as $product) {
            $products[] = $product->product_stripe_id;
        }

        $mostCommonProduct = array_count_values($products);
        arsort($mostCommonProduct);

        $mostCommonProductId = key($mostCommonProduct);

        $mostCommonProductName = Products::where('product_stripe_id', $mostCommonProductId)->first()->product_stripe_name;
        $mostCommonProductImage = Cashier::stripe()->products->retrieve($mostCommonProductId)->images ? Cashier::stripe()->products->retrieve($mostCommonProductId)->images[0] : null;

        return [
            'product_id' => $mostCommonProductId,
            'product_name' => $mostCommonProductName,
            'product_image' => $mostCommonProductImage
        ];
    }

    private function getMostCommonProducts(): array
    {
        // grab the top 5 products based on the bought number
        $ALL_PRODUCTS = Products::orderBy('bought', 'desc')->take(8)->get();
        $products = [];

        foreach ($ALL_PRODUCTS as $product) {
            $PRODUCT_NAME = Products::where('product_stripe_id', $product->product_stripe_id)->first()->product_stripe_name;
            $PRODUCT_IMAGE = Cashier::stripe()->products->retrieve($product->product_stripe_id)->images ? Cashier::stripe()->products->retrieve($product->product_stripe_id)->images[0] : null;

            $products[] = [
                'product_id' => $product->product_stripe_id,
                'product_name' => $PRODUCT_NAME,
                'product_image' => $PRODUCT_IMAGE
            ];
        }

        return $products;
    }
}
