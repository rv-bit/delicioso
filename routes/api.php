<?php

use App\Http\Controllers\Api\DummyController;
use Illuminate\Support\Facades\Route;

Route::get('/test', [DummyController::class, 'index']);