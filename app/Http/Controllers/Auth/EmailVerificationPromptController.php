<?php

namespace App\Http\Controllers\auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EmailVerificationPromptController extends Controller
{
    /**
     * Display the email verification prompt.
     */
    public function __invoke(Request $request): RedirectResponse|Response
    {
        return $request->user()->hasVerifiedEmail()
            ? redirect()->intended(route('profile.dashboard', absolute: false))
            : Inertia::render('auth/VerifyEmail', ['status' => session('status')]);
    }
}
