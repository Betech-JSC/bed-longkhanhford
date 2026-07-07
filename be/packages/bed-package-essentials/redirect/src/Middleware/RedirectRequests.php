<?php

namespace JamstackVietnam\Redirect\Middleware;

use Closure;

class RedirectRequests
{
    /**
     * Handle an incoming request.
     *
     * @param $request
     * @param Closure $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        $redirect = app('redirect.model')->findValidOrNull($request->path());

        if (! $redirect && $request->getQueryString()) {
            $path = $request->path().'?'.$request->getQueryString();
            $redirect = app('redirect.model')->findValidOrNull($path);
        }

        if ($redirect && $redirect->exists) {
            return redirect($redirect->new_url, $redirect->status_code);
        }

        return $next($request);
    }
}
