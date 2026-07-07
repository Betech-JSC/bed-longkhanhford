<?php

namespace JamstackVietnam\Core\Controllers\Auth;

use Illuminate\Routing\Controller;
use App\Models\Admin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Illuminate\Auth\Notifications\ResetPassword;

class PasswordResetLinkController extends Controller
{
    /**
     * Display the password reset link request view.
     *
     * @return \Inertia\Response
     */
    public function create()
    {
        return Inertia::render('@Core/Auth/ForgotPassword', [
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming password reset link request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        $admin = Admin::where('email', $request->only('email'))->firstOrFail();
        $token = Password::broker('admins')->createToken($admin);
        ResetPassword::createUrlUsing(function ($admin, $token) {
            return route('admin.password.reset', [
                'token' => $token,
                'email' => $admin->email
            ]);
        });
        $admin->notify(new ResetPassword($token));

        return back()->with('success', __('passwords.sent'));
    }
}
