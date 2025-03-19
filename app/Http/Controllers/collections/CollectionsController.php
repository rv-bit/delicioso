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
        switch ($any) {
            case null:
                // means no path, just the base url, so we can return the default view
                return Inertia::render('collections/index');
            case 'something':
                return Inertia::render('collections/index', [
                    'category' => 'something'
                ]);
            default:
                // if the path is not found, we can return an exception to 404, since we already handle the page there
                return abort(404);
        }
    }
}
