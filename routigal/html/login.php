<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link rel="stylesheet" href="../assets/css/login.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css">
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script type="module" src="../js/login.js" defer></script>
</head>
<body>
    <section>
        <h1>Bienvenid@ a Routigal!</h1>
        <form class="routigal-form" action="">
            <p>
                <label for="user">Usuario</label>
                <input type="text" name="user" id="user" required>
            </p>
            <p>
                <label for="pwd">Contraseña</label>
                <input type="password" name="pwd" id="pwd" required>
            </p>
            <button type="submit" id="login">Login</button>
        </form>
    </section>
</body>
</html>