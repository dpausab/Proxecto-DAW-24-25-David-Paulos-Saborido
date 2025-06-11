<?php
    include('auth.php');
    if ($_SESSION['user']['rol'] != 1) {
        header("Location: 403.php");
    }
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css">
    <link rel="stylesheet" href="/assets/css/login.css">

    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script type="module" src="/js/register.js" defer></script>
</head>
<body>
    <section>
        <h1>Regístrate en Routigal</h1>
        <form class="routiga-form" action="">
            <p>
                <label for="nombre">Nombre</label>
                <input type="text" name="nombre" id="nombre">
            </p>
            <p>
                <label for="user">Usuario</label>
                <input type="text" name="user" id="user">
            </p>
            <p id="old">
                <label for="old_pwd">Contraseña actual</label>
                <input type="password" name="old_pwd" id="old_pwd">
            </p>
            <p>
                <label for="pwd">Contraseña</label>
                <input type="password" name="pwd" id="pwd">
            </p>
            <p>
                <label for="rol">Rol</label>
                <select name="rol" id="rol"></select>
            </p>
            <p id="buttons">
                <button>
                    <a href="usuarios.php">Volver</a>
                </button>
                <button type="submit" id="register">Enviar</button>
            </p>
        </form>
    </section>
</body>
</html>