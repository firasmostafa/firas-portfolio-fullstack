<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\MessageController;

Route::apiResource('projects', ProjectController::class);

Route::apiResource('messages', MessageController::class)
    ->only(['index', 'store', 'show', 'destroy']);
