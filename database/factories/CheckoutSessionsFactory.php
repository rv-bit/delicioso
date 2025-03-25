<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\CheckoutSessions>
 */
class CheckoutSessionsFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = \App\Models\CheckoutSessions::class;

    public function definition(): array
    {
        return [
            'stripe_session_id' => $this->faker->word,
            'paid' => $this->faker->word,
        ];
    }
}
