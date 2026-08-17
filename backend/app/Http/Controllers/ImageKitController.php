<?php

namespace App\Http\Controllers;

use ImageKit\ImageKit;
use Throwable;

class ImageKitController extends Controller
{
    public function auth()
    {
        try {
            $imageKit = new ImageKit(
                env('IMAGEKIT_PUBLIC_KEY'),
                env('IMAGEKIT_PRIVATE_KEY'),
                env('IMAGEKIT_URL_ENDPOINT')
            );

            $authParameters =
                $imageKit->getAuthenticationParameters();

            return response()->json([
                'success' => true,
                'data' => [
                    'token' => $authParameters->token,
                    'expire' => $authParameters->expire,
                    'signature' => $authParameters->signature,
                    'publicKey' => env('IMAGEKIT_PUBLIC_KEY'),
                ],
            ]);
        } catch (Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }
}
