<?php

namespace App\Http\Controllers\collections;

use App\Http\Controllers\Controller;

use Illuminate\Http\Request;

use Inertia\Inertia;
use Inertia\Response;

use Laravel\Cashier\Cashier;

class CollectionsController extends Controller
{
    public function index(Request $request, $any = null): Response
    {
        if ($any) {
            // Handle specific categories or paths

            return Inertia::render('collections/index', [
                'category' => $any
            ]);
        }

        return Inertia::render('collections/index');
    }
}
