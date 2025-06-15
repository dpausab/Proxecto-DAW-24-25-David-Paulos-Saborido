<?php
include_once("../api/controller/AuthController.php");

$user = AuthController::getSessionUser();

?>
<header>
  <figure class="logo">
    <a href="dashboard.php">Routigal</a>
  </figure>

  <button id="boton-hamburguesa" class="hamburger">
    <span></span>
    <span></span>
    <span></span>
  </button>

  <nav id="menu-nav">
    <ul>
      <li><a href="/html/dashboard.php">Inicio</a></li>
      <li><a href="/html/listado_rutas.php">Rutas</a></li>
      <li><a href="/html/servicios.php">Servicios</a></li>
      <?php 
        if ($user->getRol() === 1) {
          echo '<li><a href="/html/ubicaciones.php">Ubicaciones</a></li>';
          echo '<li><a href="/html/usuarios.php">Usuarios</a></li>';
        }
      ?>
      <li><a href="/api/auth/logout" class="btn-yellow">Cerrar sesión</a></li>
    </ul>
  </nav>
</header>