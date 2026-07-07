<?php

namespace JamstackVietnam\Core\Controllers\Auth;

use Illuminate\Routing\Controller;
use App\Providers\RouteServiceProvider;
use Illuminate\Http\Request;

class EmailVerificationNotificationController extends Controller
{
    /**
     * Send a new email verification notification.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request)
    {
        if ($request->guard('admin')->user()->hasVerifiedEmail()) {
            return redirect()->intended(RouteServiceProvider::HOME);
        }

        $request->guard('admin')->user()->sendEmailVerificationNotification();

        return back()->with('status', 'verification-link-sent');
    }
}
