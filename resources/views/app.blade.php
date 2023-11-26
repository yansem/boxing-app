<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Application</title>
    @vite('resources/sass/app.scss')
</head>
<body>
<div id="app"></div>
@vite('resources/js/app.js')
</body>
<script src="https://kit.fontawesome.com/4ed2772191.js" crossorigin="anonymous"></script>
</html>