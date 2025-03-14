<?php

namespace App\Http\Controllers\root;

use App\Http\Controllers\Controller;

use Inertia\Inertia;
use Inertia\Response;

class RootController extends Controller
{
    public function index()
    {
        $tabsSectionCategories = array(
            (object) [
                "title" => "Bread",
                "img" => "/media/landing/section-tabs/Bread_Tab.webp",
                "imgPreview" => "/media/landing/section-tabs/Bread_Tab_Preview.webp",
            ],
            (object) [
                "title" => "Savouries",
                "img" => "/media/landing/section-tabs/Savouries_Tab.webp",
                "imgPreview" => "/media/landing/section-tabs/Savouries_Tab_Preview.webp",
            ],
            (object) [
                "title" => "Cakes",
                "img" => "/media/landing/section-tabs/Cake_Tab.webp",
                "imgPreview" => "/media/landing/section-tabs/Cake_Tab_Preview.webp",
            ],
        );

        return Inertia::render('landing/index', [
            'tabsSectionCategories' => $tabsSectionCategories,
        ]);
    }
}
