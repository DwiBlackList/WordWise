﻿<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
   
    <title>Laravel</title>

    <!-- Fonts -->
    {{--    <link href="https://fonts.bunny.net/css2?family=Nunito:wght@400;600;700&display=swap" rel="stylesheet">--}}

    <!-- Styles -->
    @vite('resources/css/editor.css')
</head>
<body class="antialiased">

<div id="toolbar">
    <button id="add-dialogue">Add Dialogue</button>
    <button id="add-choice">Add Choice</button>
    <button id="add-end">Add End</button>
    <button id="export">export</button>
    <button id="undo">Undo</button>
    <button id="redo">Redo</button>
    <button id="reset-zoom">Reset Zoom</button>
    <div id="zoom-label">100%</div>
</div>

<div id="canvas-container">
    <div id="canvas">
        <div id="node-container">
        </div>
    </div>
</div>

<div class="tooltip">
    <button id="toggle-tooltip" class="tooltip-button-showed">
        <span id="icon"></span>
    </button>
    <div id="tooltip-content">
        <p><strong>Shortcuts:</strong></p>
        <ul>
            <li><strong>Add Dialogue:</strong> Click "Add Dialogue"</li>
            <li><strong>Add Choice:</strong> Click "Add Choice"</li>
            <li><strong>Add Label:</strong> Click "Add Label"</li>
            <li><strong>Undo:</strong> Ctrl + Z</li>
            <li><strong>Redo:</strong> Ctrl + Shift + Z</li>
            <li><strong>Delete Node:</strong> X or Delete key</li>
            <li><strong>Zoom:</strong> Shift + Scroll</li>
            <li><strong>Pan:</strong> Left Click + Drag</li>
            <li><strong>Reset Zoom:</strong> Click "Reset Zoom"</li>
        </ul>
    </div>
</div>


@vite(['resources/ts/App.ts'])
</body>
</html>
