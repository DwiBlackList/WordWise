<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard</title>
    @vite(['resources/js/Dashboard.tsx', 'resources/css/app.css'])
</head>

<body>
    <div id="app" data-ssr="{{ $ssrData }}"></div>
</body>

</html>
