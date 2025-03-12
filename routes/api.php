<?php

use App\Http\Controllers\api\DummyController;
use Illuminate\Support\Facades\Route;

Route::get('/test', [DummyController::class, 'index']);
