<?php

namespace App\Http\Resources\products;

use App\Enum\CategoriesEnum;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductsResource extends JsonResource
{
    public static $wrap = false;

    public function toArray(Request $request): array
    {
        // going to be returned from function calling the db from all products bought, and then we will get the most common category and product
        return [
            'most_common_category' => [
                'category_id' => "sharing_boxes",
                'category_name' => CategoriesEnum::SharingBoxes->value
            ],
            'most_common_product' => [
                'product_id' => "something-id",
                'product_name' => "something-name",
                'product_image' => "/media/landing/items/6_hot_cross_buns.webp",
            ]
        ];
    }
}
