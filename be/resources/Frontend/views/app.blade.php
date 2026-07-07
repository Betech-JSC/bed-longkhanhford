<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="shortcut icon" type="image/png" href="/favicon.png" />
    <title inertia>{{ config('app.name', 'Laravel') }}</title>
    @routes
</head>

<body>
    @inertia
</body>

</html>
