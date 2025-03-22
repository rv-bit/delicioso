<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ProductsNutrition extends Model
{
    use HasFactory;

    protected $table = 'products_nutrition';
    protected $fillable = [
        'product_id',
        'calories',
        'carbs',
        'carbs_of_sugar',
        'proteins',
        'fiber',
        'sodium',
        'fat',
        'fat_of_saturated',
    ];

    /**
     * Define an inverse one-to-one relationship with Products.
     */
    public function product()
    {
        return $this->belongsTo(Products::class, 'product_id');
    }
}
