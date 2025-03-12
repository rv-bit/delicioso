<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class DummyController extends Controller
{
    public function index(): JsonResponse
    {
        $data = [
            'name' => 'John Doe',
            'age' => 30,
            'email' => 'johndoe@example.com'
        ];

        return response()->json([
            'success' => true,
            'data' => $data
        ]);
    }
}
