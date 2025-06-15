<?php
    include_once("../assets/dir.php");
    include_once("auth.php");
    include_once(API_ROUTE."controller/AuthController.php");

    $user = AuthController::getSessionUser();
    if ($user->getRol() != 1) {
        header("Location: 403.php");
    }
?>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Usuarios - Routigal</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css">
  <link rel="stylesheet" href="../assets/css/servicios.css">
  <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11" defer></script>
  <script type="module" src="../js/usuarios.js" defer></script>
  <script src="../js/menu-hamburguesa.js" defer></script>
</head>
<body>
  <?php include_once('header.php'); ?>

  <main>
    <h1>Usuarios</h1>
    <section class="table-container">
      <h2>Listado de usuarios</h2>
      <form class="routigal-form" id="filtros">
        <p>
          <label for="cliente">Nombre</label>
          <input type="text" name="nombre_filtro" id="nombre_filtro" placeholder="Nombre del usuario" />
        </p>
        <p>
          <label for="rol">Rol</label>
          <select name="rol_filtro" id="rol_filtro">
          </select>
        </p>
        <p>
          <button id="crear">
            Crear
          </button>
        </p>
      </form>
      <table class="usuarios-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
        </tbody>
      </table>
    </section>
  </main>
  <?php include_once ('footer.php'); ?>
</body>
</html>

