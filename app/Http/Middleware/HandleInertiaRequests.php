<?php

namespace App\Http\Middleware;

use App\Enum\CategoriesEnum;

use App\Http\Resources\products\ProductsResource;
use App\Http\Resources\user\AuthUserResource;

use Illuminate\Http\Request;
use Inertia\Middleware;
use Tighten\Ziggy\Ziggy;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user() ? new AuthUserResource($request->user()) : null,
            ],
            'ziggy' => fn() => [
                ...(new Ziggy)->toArray(),
                'location' => $request->url(),
            ],
            'categories' => [
                'labels' => CategoriesEnum::labels(),
                'images' => CategoriesEnum::images(),
            ],
            'most_common_data' => new ProductsResource($request),
            'flash' => [
                'successPayment' => session('successPayment'),
            ],
        ];
    }
}
