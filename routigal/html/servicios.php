<?php
include_once("auth.php");
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>

    <link rel="stylesheet" href="../css/style.css">
    <script type="module" src="../js/servicios.js" defer></script>
</head>
<body>
    <h1>
        Listado de servicios
    </h1>

    <table>
        <thead>
            <tr>
                <td>ID</td>
                <td>Ruta</td>
                <td>Cliente</td>
                <td>Longitud</td>
                <td>Latitud</td>
                <td>Estado</td>
                <td>Descripción</td>
                <td>Tiempo Estimado</td>
            </tr>
        </thead>
        <tbody class="servicios">
            
        </tbody>
    </table>
</body>
</html>