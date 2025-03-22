<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('product_stripe_id');
            $table->string('product_stripe_name');
            $table->string('product_stripe_description');
            $table->string('product_stripe_price');
            $table->integer('stock');
            $table->string('category_id');
            $table->boolean('active')->default(true);
            $table->integer('bought')->default(0);
            $table->timestamps();
        });

        Schema::create('products_nutrition', function (Blueprint $table) {
            $table->id();
            $table->string('product_id');
            $table->string('calories');
            $table->string('carbs');
            $table->string('carbs_of_sugar');
            $table->string('proteins');
            $table->string('fiber');
            $table->string('sodium');
            $table->string('fat');
            $table->string('fat_of_saturated');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
        Schema::dropIfExists('products_nutrition');
    }
};
