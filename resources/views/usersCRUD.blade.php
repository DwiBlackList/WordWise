<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Users</title>
    <link rel="icon" type="image" href="/logo.svg" />
    <meta name="csrf-token" content="{{ csrf_token() }}">
    @vite(['resources/js/UsersCRUD.tsx', 'resources/css/app.css'])
</head>

<body>
    <div id="app" users="{{ $users }}"></div>
</body>

</html>
