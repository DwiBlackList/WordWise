<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Level</title>
    <link rel="icon" type="image" href="/logo.svg" />
    <meta name="csrf-token" content="{{ csrf_token() }}">
    @vite(['resources/js/LevelCRUD.tsx', 'resources/css/app.css'])
</head>

<body>
    <div id="app" class="{{ $class }}" levels="{{ $levels }}"></div>
</body>

</html>
