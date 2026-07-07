<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="robots" content="noindex" />

    <title inertia>{{ config('app.name', 'Laravel') }}</title>

    {{ Vite::useHotFile(public_path('vite.backend.hot'))->useBuildDirectory('build/backend')->withEntryPoints(['resources/Backend/js/app.js']) }}

    @routes
</head>

<body>
    @inertia
</body>

</html>
