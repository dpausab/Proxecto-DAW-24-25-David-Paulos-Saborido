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
  <title>Ubicaciones - Routigal</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css">
  <link rel="stylesheet" href="../assets/css/listado.css">
  <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11" defer></script>
  <script type="module" src="../js/ubicaciones.js" defer></script>
  <script src="../js/menu-hamburguesa.js" defer></script>
</head>
<body>
  <?php include_once('header.php'); ?>

  <main>
    <h1>Ubicaciones</h1>
    <section id="form">
        <form class="routigal-form" id="form-ubicaciones">
        <p class="id">
            <input type="text" name="id" id="id" hidden>
        </p>
        <p>
            <label for="nombre">Nombre</label>
            <input type="text" name="nombre" id="nombre" placeholder="Nombre" required>
        </p>
        <p>
            <label for="latitud">Latitud</label>
            <input type="text" name="latitud" id="latitud" required>
        </p>
        <p>
            <label for="longitud">Longitud</label>
            <input type="text" name="longitud" id="longitud" required>
        </p>
        <button type="submit">Guardar ubicacion</button>
        </form>
    </section>  
    <section class="table-container">
      <h2>Listado de ubicaciones</h2>
      <form class="routigal-form" id="filtros">
        <p>
          <label for="nombre_filtro">Nombre</label>
          <input type="text" name="nombre_filtro" id="nombre_filtro" placeholder="Nombre de la ubicación" />
        </p>
      </form>
      <div id="paginacion"></div>
      <table class="ubicaciones-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Latitud</th>
            <th>Longitud</th>
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

