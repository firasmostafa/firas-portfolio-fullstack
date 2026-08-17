<?php
use App\Http\Controllers\ImageKitController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\SiteContentController;

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/

// Admin login
Route::post('/login', [AuthController::class, 'login']);

// Anyone can view projects
Route::get('/projects', [ProjectController::class, 'index']);
Route::get('/projects/{id}', [ProjectController::class, 'show']);

// Anyone can send a contact message
Route::post('/messages', [MessageController::class, 'store']);
 // Anyone can view site content
Route::get('/site-content', [SiteContentController::class, 'index']);
/*
|--------------------------------------------------------------------------
| Protected Admin Routes
|--------------------------------------------------------------------------
*/

Route::middleware('auth:sanctum')->group(function () {

    Route::post('/logout', [AuthController::class, 'logout']);

    // Project management
    Route::post('/projects', [ProjectController::class, 'store']);
    Route::put('/projects/{id}', [ProjectController::class, 'update']);
    Route::patch('/projects/{id}', [ProjectController::class, 'update']);
    Route::delete('/projects/{id}', [ProjectController::class, 'destroy']);

    // Messages management
    Route::get('/messages', [MessageController::class, 'index']);
    Route::get('/messages/{message}', [MessageController::class, 'show']);
    Route::delete('/messages/{message}', [MessageController::class, 'destroy']);

    Route::get('/imagekit-auth', [ImageKitController::class, 'auth']);
// Site content management
Route::middleware('auth:sanctum')->group(function () {

    Route::put(
        '/site-content',
        [SiteContentController::class, 'update']
    );

    Route::patch(
        '/site-content',
        [SiteContentController::class, 'update']
    );

});

});
