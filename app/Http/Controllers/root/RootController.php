<?php

namespace App\Http\Controllers\root;

use App\Http\Controllers\Controller;

use Inertia\Inertia;
use Inertia\Response;

class RootController extends Controller
{
    public function index()
    {
        $tabsSectionData = array(
            (object) [
                "title" => "Bread",
                "img" => "/media/landing/Bread_Tab.webp",
                "imgPreview" => "/media/landing/Bread_Tab_Preview.webp",
            ],
            (object) [
                "title" => "Savouries",
                "img" => "/media/landing/Savouries_Tab.webp",
                "imgPreview" => "/media/landing/Savouries_Tab_Preview.webp",
            ],
            (object) [
                "title" => "Cakes",
                "img" => "/media/landing/Cake_Tab.webp",
                "imgPreview" => "/media/landing/Cake_Tab_Preview.webp",
            ],
        );

        return Inertia::render('landing/index', [
            'tabsSectionData' => $tabsSectionData,
        ]);
    }
}
