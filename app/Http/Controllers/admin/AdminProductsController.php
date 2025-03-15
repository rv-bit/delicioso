<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;

use Illuminate\Http\Request;

use Inertia\Inertia;
use Inertia\Response;

use Laravel\Cashier\Cashier;

class AdminProductsController extends Controller
{
    public function index(Request $request): Response
    {
        $data = $this->getStripeAllProducts();

        return Inertia::render('profile/admin/dashboard', [
            'products' => $data['products'],
            'prices' => $data['prices']
        ]);
    }

    private function getStripeAllProducts()
    {
        $products = Cashier::stripe()->products->all();
        $prices = Cashier::stripe()->prices->all();

        return [
            'products' => $products->data,
            'prices' => $prices->data
        ];
    }
}
