<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Products extends Model
{
    use HasFactory;

    protected $table = 'products';
    protected $fillable = [
        'product_stripe_id',
        'product_stripe_name',
        'product_stripe_description',
        'product_stripe_price',
        'stock',
        'category_id',
        'active',
        'bought',
    ];
}
