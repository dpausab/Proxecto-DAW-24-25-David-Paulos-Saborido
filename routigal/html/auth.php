<?php
session_start();
$tiempo_maximo = 600;

if (!isset($_SESSION['user'])) {
    header("Location: login.php");
    exit();
} else {
    // Si el usuario no cambia de página o realiza alguna acción, se rompe la sesión.
    if (time() - $_SESSION['user']['tiempo'] > $tiempo_maximo) {
        session_unset();
        session_destroy();
        header("Location: login.php");
        exit();
    } else {
        $_SESSION['user']['tiempo'] = time();
    }
}