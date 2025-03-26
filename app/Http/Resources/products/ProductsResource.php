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
            'most_common_categories' => $this->getMostCommonCategories(),
            'most_common_product' => $this->getMostCommonProduct(),
            'best_seller_products' => $this->getMostCommonProducts()
        ];
    }

    private function getMostCommonCategories(): array
    {
        $allProducts = Products::all();
        $categoryCounts = [];

        foreach ($allProducts as $product) {
            $categoryId = $product->category_id;

            if (!isset($categoryCounts[$categoryId])) {
                $categoryCounts[$categoryId] = 0;
            }

            $categoryCounts[$categoryId]++;
        }

        // descending order
        arsort($categoryCounts);
        $topCategories = array_slice(array_keys($categoryCounts), 0, 3, true);

        $mostCategories = [];
        foreach ($topCategories as $categoryId) {
            $categoryEnum = CategoriesEnum::from($categoryId);
            $images = CategoriesEnum::images()[$categoryEnum->value] ?? null;

            $mostCategories[] = [
                'category_id' => $categoryId,
                'category_name' => $categoryEnum->label(),
                'category_image' => $images['img'],
                'category_image_preview' => $images['imgPreview'] ?? null
            ];
        }

        return $mostCategories;
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

        // descending order
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
        $ALL_PRODUCTS = Products::where('active', true)->orderBy('bought', 'desc')->take(8)->get();
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
