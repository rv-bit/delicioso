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
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
