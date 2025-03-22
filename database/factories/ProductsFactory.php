<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Products>
 */
class ProductsFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = \App\Models\Products::class;
    protected $model_nutrition = \App\Models\ProductsNutrition::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'product_stripe_id' => $this->faker->word,
            'product_stripe_name' => $this->faker->word,
            'product_stripe_description' => $this->faker->text,
            'product_stripe_price' => $this->faker->randomFloat(2, 0, 9999999999.99),
            'stock' => $this->faker->randomNumber(0),
            'category_id' => $this->faker->randomNumber(0),
            'active' => $this->faker->boolean,
            'bought' => $this->faker->randomNumber(0),

            'nutrition' => [
                'calories' => $this->faker->randomNumber(0),
                'carbs' => $this->faker->randomNumber(0),
                'carbs_of_sugar' => $this->faker->randomNumber(0),
                'proteins' => $this->faker->randomNumber(0),
                'fiber' => $this->faker->randomNumber(0),
                'sodium' => $this->faker->randomNumber(0),
                'fat' => $this->faker->randomNumber(0),
                'fat_of_saturated' => $this->faker->randomNumber(0),
            ],
        ];
    }
}
